import { SourceLocation } from '../SourceLocation'
import { SourceType } from '../SourceType'
import { BufferedStream } from './BufferedStream'

/**
 * Helper class for defining the padding (characters to remove, typically
 * whitespace) in a string or heregexp. Also tracks "line separators", which are
 * newline characters in multiline single and double quoted strings that should
 * be turned into space characters.
 *
 * Example usage:
 *
 * let paddingTracker = new PaddingTracker(source, stream, SSTRING_END);
 *
 * // Examine underlying code to see what padding to add.
 * paddingTracker.fragments[0].content;
 *
 * // Mark padding for each fragment, indexed relative to the fragment content.
 * paddingTracker.fragments[0].markPadding(3, 5);
 * paddingTracker.fragments[1].markPadding(1, 4);
 * paddingTracker.fragments[1].markLineSeparator(5);
 *
 * // Compute the replacement source locations for the entire string/heregexp.
 * paddingTracker.computeSourceLocations();
 */
export class PaddingTracker {
  readonly fragments: Array<TrackedFragment>
  private _originalLocations: Array<SourceLocation>

  constructor(source: string, stream: BufferedStream, endType: SourceType) {
    this.fragments = []
    this._originalLocations = []

    let interpolationLevel = 0
    let location
    do {
      location = stream.shift()
      this._originalLocations.push(location)
      if (
        interpolationLevel === 0 &&
        location.type === SourceType.STRING_CONTENT
      ) {
        const start = location.index
        const end = stream.peek().index
        const content = source.slice(start, end)
        const index = this.fragments.length
        this.fragments.push(new TrackedFragment(content, start, end, index))
      } else if (location.type === SourceType.INTERPOLATION_START) {
        interpolationLevel += 1
      } else if (location.type === SourceType.INTERPOLATION_END) {
        interpolationLevel -= 1
      }
    } while (interpolationLevel > 0 || location.type !== endType)
  }

  computeSourceLocations(): Array<SourceLocation> {
    const resultLocations: Array<SourceLocation> = []
    let rangeIndex = 0
    for (const location of this._originalLocations) {
      const currentRange = this.fragments[rangeIndex]
      if (
        location.type === SourceType.STRING_CONTENT &&
        currentRange &&
        location.index === currentRange.start
      ) {
        resultLocations.push(...currentRange.computeSourceLocations())
        rangeIndex++
      } else {
        resultLocations.push(location)
      }
    }
    if (rangeIndex !== this.fragments.length) {
      throw new Error('Expected ranges to correspond to original locations.')
    }
    return resultLocations
  }
}

export interface PaddingRange {
  readonly start: number
  readonly end: number
}
type LocationEvent =
  | 'START_PADDING'
  | 'END_PADDING'
  | 'START_LINE_SEPARATOR'
  | 'END_LINE_SEPARATOR'

export class TrackedFragment {
  readonly content: string
  readonly start: number
  readonly end: number
  readonly index: number
  readonly _paddingRanges: Array<PaddingRange>
  readonly _lineSeparators: Array<number>

  constructor(content: string, start: number, end: number, index: number) {
    this.content = content
    this.start = start
    this.end = end
    this.index = index
    this._paddingRanges = []
    this._lineSeparators = []
  }

  markPadding(startIndex: number, endIndex: number): void {
    this._paddingRanges.push({ start: startIndex, end: endIndex })
  }

  markLineSeparator(index: number): void {
    this._lineSeparators.push(index)
  }

  computeSourceLocations(): Array<SourceLocation> {
    if (this.start === this.end) {
      return [new SourceLocation(SourceType.STRING_CONTENT, this.start)]
    }

    // Break the marked ranges down into events, similar to how you might count
    // paren nesting. At each index, we can then know if we're inside padding,
    // a line separator, or neither.
    const eventsByIndex: Array<Array<LocationEvent>> = []
    for (let i = 0; i < this.end - this.start + 1; i++) {
      eventsByIndex.push([])
    }
    for (const range of this._paddingRanges) {
      eventsByIndex[range.start].push('START_PADDING')
      eventsByIndex[range.end].push('END_PADDING')
    }
    for (const separatorIndex of this._lineSeparators) {
      eventsByIndex[separatorIndex].push('START_LINE_SEPARATOR')
      eventsByIndex[separatorIndex + 1].push('END_LINE_SEPARATOR')
    }

    const resultLocations: Array<SourceLocation> = []
    let lastSourceType = null
    let paddingDepth = 0
    let lineSeparatorDepth = 0
    for (let sourceIndex = this.start; sourceIndex < this.end; sourceIndex++) {
      for (const event of eventsByIndex[sourceIndex - this.start]) {
        if (event === 'START_PADDING') {
          paddingDepth += 1
        } else if (event === 'END_PADDING') {
          paddingDepth -= 1
        } else if (event === 'START_LINE_SEPARATOR') {
          lineSeparatorDepth += 1
        } else if (event === 'END_LINE_SEPARATOR') {
          lineSeparatorDepth -= 1
        }
      }
      if (
        paddingDepth < 0 ||
        lineSeparatorDepth < 0 ||
        (paddingDepth > 0 && lineSeparatorDepth > 0)
      ) {
        throw new Error(
          `Illegal padding state: paddingDepth: ${paddingDepth}, lineSeparatorDepth: ${lineSeparatorDepth}`
        )
      }

      let sourceType
      if (paddingDepth > 0) {
        sourceType = SourceType.STRING_PADDING
      } else if (lineSeparatorDepth > 0) {
        sourceType = SourceType.STRING_LINE_SEPARATOR
      } else {
        sourceType = SourceType.STRING_CONTENT
      }
      if (sourceType !== lastSourceType) {
        resultLocations.push(new SourceLocation(sourceType, sourceIndex))
        lastSourceType = sourceType
      }
    }
    return resultLocations
  }
}
