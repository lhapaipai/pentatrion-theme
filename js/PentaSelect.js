// utility functions
function triggerClick(el) {
  let event = new Event('click', {
    bubbles: true
  })
  el.dispatchEvent(event)
}

function triggerChange(el) {
  let event = new Event('change', {
    bubbles: true
  })
  el.dispatchEvent(event)
}

function triggerFocusIn(el) {
  let event = new Event('focusin', {
    bubbles: true
  })
  el.dispatchEvent(event)
}

function triggerFocusOut(el) {
  let event = new Event('focusout', {
    bubbles: true
  })
  el.dispatchEvent(event)
}

function hasClass(el, className) {
  if (el) return el.classList.contains(className)
  else return false
}

function addClass(el, className) {
  if (el) return el.classList.add(className)
}

function removeClass(el, className) {
  if (el) return el.classList.remove(className)
}

var defaultOptions = {
  data: null,
  searchable: false,
  selectedItemPlaceholder: ' éléments sélectionnés'
}

function PentaSelect(element, options) {
  this.el = element
  this.config = Object.assign({}, defaultOptions, options || {})
  this.data = this.config.data
  this.selectedOptions = []
  this.id = 'select-' + Math.floor(Math.random() * 100000)
  this.placeholder = this.el.getAttribute('placeholder') || this.config.placeholder || 'Select an option'

  this.dropdown = null
  this.multiple = this.el.getAttribute('multiple') !== null
  this.disabled = this.el.getAttribute('disabled') !== null

  this._onClicked = this._onClicked.bind(this)
  this._onKeyPressed = this._onKeyPressed.bind(this)
  this._onClickedOutside = this._onClickedOutside.bind(this)
  this.triggerFocusIn = triggerFocusIn.bind(this, this.el)
  this.triggerFocusOut = triggerFocusOut.bind(this, this.el)

  this.create()
}

PentaSelect.prototype.create = function () {
  this.el.style.display = 'none'
  if (this.data) {
    this.processData(this.data)
  } else {
    this.extractData()
  }

  this.renderDropdown()
  this.bindEvent()
}

PentaSelect.prototype.processData = function (data) {
  var options = []
  data.forEach((item) => {
    options.push({
      data: item,
      attributes: {
        selected: false,
        disabled: false,
        optgroup: item.value == 'optgroup'
      }
    })
  })
  this.options = options
}

PentaSelect.prototype.extractData = function () {
  var options = this.el.querySelectorAll('option,optgroup')
  var data = []
  var allOptions = []
  var selectedOptions = []

  options.forEach((item) => {
    let itemData
    if (item.tagName == 'OPTGROUP') {
      itemData = {
        text: item.label,
        value: 'optgroup'
      }
    } else {
      itemData = {
        text: item.innerText,
        value: item.value
      }
    }

    var attributes = {
      selected: item.getAttribute('selected') !== null,
      disabled: item.getAttribute('disabled') !== null,
      optgroup: item.tagName == 'OPTGROUP'
    }

    data.push(itemData)
    allOptions.push({ data: itemData, attributes: attributes })
  })

  this.data = data
  this.options = allOptions
  this.options.forEach(function (item) {
    if (item.attributes.selected) selectedOptions.push(item)
  })

  this.selectedOptions = selectedOptions
}

PentaSelect.prototype.renderDropdown = function () {
  var classes = [
    'penta-select-enhanced',
    this.el.className || '',
    this.disabled ? 'disabled' : '',
    this.multiple ? 'has-multiple' : ''
  ]

  let searchHtml = `<div class="penta-select-search-box">
<input type="text" class="penta-select-search" placeholder="Search..."/>
</div>`

  var html = `<div class="${classes.join(' ')}" tabindex="${this.disabled ? null : 0}">
  <span class="${this.multiple ? 'multiple-options' : 'current'}"></span>
  <div class="penta-select-dropdown">
  ${this.config.searchable ? searchHtml : ''}
  <ul class="list"></ul>
  </div><span class="arrow"></span></div>
`

  this.el.insertAdjacentHTML('afterend', html)

  this.dropdown = this.el.nextElementSibling
  this._renderSelectTitle()
  this._renderItems()
}

PentaSelect.prototype._renderSelectTitle = function () {
  if (this.multiple) {
    var selectedHtml = ''
    if (window.getComputedStyle(this.dropdown).width == 'auto' || this.selectedOptions.length < 2) {
      this.selectedOptions.forEach(function (item) {
        selectedHtml += `<span class="current">${item.data.text}</span>`
      })
      selectedHtml = selectedHtml == '' ? this.placeholder : selectedHtml
    } else {
      selectedHtml = this.selectedOptions.length + this.config.selectedItemPlaceholder
    }

    this.dropdown.querySelector('.multiple-options').innerHTML = selectedHtml
  } else {
    var html = this.selectedOptions.length > 0 ? this.selectedOptions[0].data.text : this.placeholder

    this.dropdown.querySelector('.current').innerHTML = html
  }
}

PentaSelect.prototype._renderItems = function () {
  var ul = this.dropdown.querySelector('ul')
  this.options.forEach((item) => {
    ul.appendChild(this._renderItem(item))
  })
}

PentaSelect.prototype._renderItem = function (option) {
  var el = document.createElement('li')
  let selected = option.attributes.selected
  let disabled = option.attributes.disabled

  let content
  if (this.multiple) {
    content = `<span class="penta-input-checkbox fake-input ${disabled ? 'disabled' : ''} ${
      selected ? 'checked' : ''
    }"></span><span class="fake-label">${option.data.text}</span>`
  } else {
    content = `<span class="penta-input-radio fake-input ${disabled ? 'disabled' : ''} ${
      selected ? 'checked' : ''
    }"></span><span class="fake-label">${option.data.text}</span>`
  }

  el.innerHTML = content
  if (option.attributes.optgroup) {
    el.classList.add('optgroup')
  } else {
    el.setAttribute('data-value', option.data.value)
    el.classList.add('option')
    if (option.attributes.selected) {
      el.classList.add('selected')
    }
    if (option.attributes.disabled) {
      el.classList.add('disabled')
    }

    el.addEventListener('click', this._onItemClicked.bind(this, option))
  }

  option.element = el
  return el
}

PentaSelect.prototype.update = function () {
  this.extractData()
  if (this.dropdown) {
    var open = hasClass(this.dropdown, 'open')
    this.dropdown.parentNode.removeChild(this.dropdown)
    this.create()

    if (open) {
      triggerClick(this.dropdown)
    }
  }
}

PentaSelect.prototype.disable = function () {
  if (!this.disabled) {
    this.disabled = true
    addClass(this.dropdown, 'disabled')
  }
}

PentaSelect.prototype.enable = function () {
  if (this.disabled) {
    this.disabled = false
    removeClass(this.dropdown, 'disabled')
  }
}

PentaSelect.prototype.clear = function () {
  this.selectedOptions = []
  this._renderSelectTitle()
  this.updateSelectValue()
  triggerChange(this.el)
}

PentaSelect.prototype.destroy = function () {
  if (this.dropdown) {
    this.dropdown.parentNode.removeChild(this.dropdown)
    this.el.style.display = ''

    this.dropdown.removeEventListener('click', this._onClicked)
    this.dropdown.removeEventListener('keydown', this._onKeyPressed)
    this.dropdown.removeEventListener('focusin', triggerFocusIn.bind(this, this.el))
    this.dropdown.removeEventListener('focusout', triggerFocusOut.bind(this, this.el))
    window.removeEventListener('click', this._onClickedOutside.bind(this))
  }
}

PentaSelect.prototype.bindEvent = function () {
  this.dropdown.addEventListener('click', this._onClicked)
  this.dropdown.addEventListener('keydown', this._onKeyPressed)
  this.dropdown.addEventListener('focusin', triggerFocusIn.bind(this, this.el))
  this.dropdown.addEventListener('focusout', triggerFocusOut.bind(this, this.el))
  window.addEventListener('click', this._onClickedOutside)

  if (this.config.searchable) {
    this._bindSearchEvent()
  }
}

PentaSelect.prototype._bindSearchEvent = function () {
  var searchBox = this.dropdown.querySelector('.penta-select-search')
  if (searchBox)
    searchBox.addEventListener('click', function (e) {
      e.stopPropagation()
      return false
    })

  searchBox.addEventListener('input', this._onSearchChanged.bind(this))
}

PentaSelect.prototype._onClicked = function (e) {
  let eltBottom = this.dropdown.getBoundingClientRect().bottom
  if (document.documentElement.clientHeight - eltBottom < 70) {
    this.dropdown.classList.add('reversed')
  } else {
    this.dropdown.classList.remove('reversed')
  }

  if (this.multiple) {
    if (e.target.classList.contains('multiple-options')) {
      this.dropdown.classList.toggle('open')
    } else {
      this.dropdown.classList.add('open')
    }
  } else {
    this.dropdown.classList.toggle('open')
  }

  if (this.dropdown.classList.contains('open')) {
    var search = this.dropdown.querySelector('.penta-select-search')
    if (search) {
      search.value = ''
      search.focus()
    }

    var t = this.dropdown.querySelector('.focus')
    if (t) {
      t.classList.remove('focus')
    }
    let currentOption = e.target.closest('.option')
    if (currentOption) {
      currentOption.classList.add('focus')
    }
    this.dropdown.querySelectorAll('ul li').forEach(function (item) {
      item.style.display = ''
    })
  } else {
    this.dropdown.focus()
  }
}

PentaSelect.prototype._onItemClicked = function (option, e) {
  var optionEl = e.target.closest('.option')
  // e.stopPropagation()

  if (!hasClass(optionEl, 'disabled')) {
    if (this.multiple) {
      if (hasClass(optionEl, 'selected')) {
        removeClass(optionEl, 'selected')
        this.selectedOptions.splice(this.selectedOptions.indexOf(option), 1)
        this.el.querySelector('option[value="' + optionEl.dataset.value + '"]').selected = false
        optionEl.querySelector('.fake-input').classList.remove('checked')
      } else {
        addClass(optionEl, 'selected')
        this.selectedOptions.push(option)
        optionEl.querySelector('.fake-input').classList.add('checked')
      }
    } else {
      this.selectedOptions.forEach(function (item) {
        removeClass(item.element, 'selected')
      })

      addClass(optionEl, 'selected')
      let listEl = optionEl.closest('.list')
      listEl.querySelectorAll('.fake-input').forEach((e) => e.classList.remove('checked'))
      optionEl.querySelector('.fake-input').classList.add('checked')
      this.selectedOptions = [option]
    }

    this._renderSelectTitle()
    this.updateSelectValue()
  }
}

PentaSelect.prototype.updateSelectValue = function () {
  if (this.multiple) {
    var select = this.el
    this.selectedOptions.forEach(function (item) {
      var el = select.querySelector('option[value="' + item.data.value + '"]')
      if (el) {
        el.setAttribute('selected', true)
      }
    })
  } else if (this.selectedOptions.length > 0) {
    this.el.value = this.selectedOptions[0].data.value
  }
  triggerChange(this.el)
}

PentaSelect.prototype._onClickedOutside = function (e) {
  if (!this.dropdown.contains(e.target)) {
    this.dropdown.classList.remove('open')
  }
}

PentaSelect.prototype._onKeyPressed = function (e) {
  // Keyboard events

  var focusedOption = this.dropdown.querySelector('.focus')

  var open = this.dropdown.classList.contains('open')
  let t
  // Space or Enter
  if (e.keyCode == 32 || e.keyCode == 13) {
    if (open) {
      triggerClick(focusedOption)
    } else {
      triggerClick(this.dropdown)
    }
  } else if (e.keyCode == 40) {
    // Down
    if (!open) {
      triggerClick(this.dropdown)
    } else {
      var next = this._findNext(focusedOption)
      if (next) {
        t = this.dropdown.querySelector('.focus')
        removeClass(t, 'focus')
        addClass(next, 'focus')
      }
    }
    e.preventDefault()
  } else if (e.keyCode == 38) {
    // Up
    if (!open) {
      triggerClick(this.dropdown)
    } else {
      var prev = this._findPrev(focusedOption)
      if (prev) {
        t = this.dropdown.querySelector('.focus')
        removeClass(t, 'focus')
        addClass(prev, 'focus')
      }
    }
    e.preventDefault()
  } else if (e.keyCode == 27 && open) {
    // Esc
    triggerClick(this.dropdown)
  }
  return false
}

PentaSelect.prototype._findNext = function (el) {
  if (el) {
    el = el.nextElementSibling
  } else {
    el = this.dropdown.querySelector('.list .option')
  }

  while (el) {
    if (!hasClass(el, 'disabled') && el.style.display != 'none') {
      return el
    }
    el = el.nextElementSibling
  }

  return null
}

PentaSelect.prototype._findPrev = function (el) {
  if (el) {
    el = el.previousElementSibling
  } else {
    el = this.dropdown.querySelector('.list .option:last-child')
  }

  while (el) {
    if (!hasClass(el, 'disabled') && el.style.display != 'none') {
      return el
    }
    el = el.previousElementSibling
  }

  return null
}

PentaSelect.prototype._onSearchChanged = function (e) {
  var open = this.dropdown.classList.contains('open')
  var text = e.target.value
  text = text.toLowerCase()

  if (text == '') {
    this.options.forEach(function (item) {
      item.element.style.display = ''
    })
  } else if (open) {
    var matchReg = new RegExp(text)
    this.options.forEach(function (item) {
      var optionText = item.data.text.toLowerCase()
      var matched = matchReg.test(optionText)
      item.element.style.display = matched ? '' : 'none'
    })
  }

  this.dropdown.querySelectorAll('.focus').forEach(function (item) {
    removeClass(item, 'focus')
  })

  var firstEl = this._findNext(null)
  addClass(firstEl, 'focus')
}

export default PentaSelect
