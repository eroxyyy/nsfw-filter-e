import { _HTMLVideoElement as Video, requestType } from '../../utils/types'
import { Filter } from './Filter'

export type IVideoFilter = {
  analyzeVideo: (video: Video) => void
}

export class VideoFilter extends Filter implements IVideoFilter {
  public analyzeVideo (video: Video): void {
    const url = VideoFilter.prepareUrl(video.poster)

    if (video._isChecked === undefined && typeof url === 'string') {
      video._isChecked = true
      video.style.visibility = 'hidden'
      video.pause()
      this._analyzeVideo(video).then(() => {}, () => {})
    }
  }

  private async _analyzeVideo (video: Video): Promise<void> {
    const posterResult = await this._checkPoster(video.poster)

    if (posterResult) {
      this.blockedItems++
      return
    }

    video.style.visibility = 'visible'
    video.play().then(() => {}, () => {})
  }

  private async _checkPoster (url: string): Promise<boolean> {
    this.logger.log(`Analyze video ${url}`)
    const request: requestType = { url }

    return await this.requestToAnalyzeImage(request)
  }
}
