import EventEmitter from './lib/EventEmitter'
import { formatDate } from './lib/utils'

/* si data contient des horodages vides compléter avec la dernière image */

class PentaInputRange extends EventEmitter {
  constructor(inputSelector, options = {}) {
    super()

    let input = (this._$input =
      typeof containerSelector === 'string' ? document.querySelector(inputSelector) : inputSelector)

    this.options = Object.assign({}, PentaInputRange.defaultOptions, options)

    this._range = parseInt(this._$input.max) - parseInt(this._$input.min)

    this._buildComponent()

    this._onInput = this._onInput.bind(this)
    this._$input.addEventListener('input', this._onInput)

    this._onInput()
  }
  destroy() {
    this._$input.removeEventListener('input', this._onInput)
  }

  _buildComponent() {
    const wrapper = document.createElement('div')
    wrapper.className = this._$input.className

    wrapper.classList.add('penta-input-range-custom')

    const trackContainer = document.createElement('div')
    trackContainer.classList.add('track-container')

    const trackElement = document.createElement('div')
    trackElement.classList.add('track-element')

    const track = document.createElement('div')
    track.classList.add('track')

    this._$trackProgress = document.createElement('div')
    this._$trackProgress.classList.add('track-progress')

    const trackTicks = document.createElement('div')
    trackTicks.classList.add('track-ticks')
    this._setTicks(trackTicks)

    trackElement.append(track, this._$trackProgress, trackTicks)
    trackContainer.append(trackElement)

    this._$input.replaceWith(wrapper)
    wrapper.append(trackContainer)
    wrapper.append(this._$input)
  }
  _setTicks(trackTicks) {
    let valuesByTick = this.options.valuesByTick || parseInt(this._$input.step) || 1
    const tickCount = this._range / valuesByTick + 1

    for (let i = 0; i < tickCount; i++) {
      let tick = document.createElement('span')
      tick.className = 'track-tick'
      trackTicks.appendChild(tick)
    }
  }
  _onInput(e = null) {
    let percent = this.getSliderPercent()
    this._$trackProgress.style.width = percent * 100 + '%'
  }
  getSliderPercent() {
    return parseInt(this._$input.value) / this._range
  }
  getInput() {
    return $this._$input
  }
}

PentaInputRange.defaultOptions = {
  valuesByTick: null // number of values between 2 ticks ()
}

export default PentaInputRange
