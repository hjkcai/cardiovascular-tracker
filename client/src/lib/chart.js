'use strict'

import state from './state'
import { CHART_FONT_SIZES, CANVAS_PADDINGS } from './constants'

import * as d3Array from 'd3-array'
import * as d3Scale from 'd3-scale'
import * as d3Shape from 'd3-shape'
import linearRegression from 'simple-statistics/src/linear_regression'

const d3 = Object.assign({}, d3Array, d3Scale, d3Shape)

const CANVAS_RATIO = 21 / 9
const TICK_SIZE = 4
const LEFT_TICKS_MARGIN = 8
const BOTTOM_TICKS_MARGIN = 6
const LEFT_AXIS_BOTTOM_PADDING = 10
const IDENTITY = a => a

// 用于决定坐标轴上有多少个 tick 要显示出来
const canvasSizeScale = d3.scaleLinear().domain([220, 325]).range([0, 2]).clamp(true)
const fontSizeScale = d3.scaleLinear().domain([14, 20]).range([0, 1]).clamp(true)
const yTicksCount = 3

/** 绘制直线 */
export function drawLine (ctx, x1, y1, x2, y2, adjust = true) {
  if (adjust) {
    x1 = Math.floor(x1) + 0.5
    y1 = Math.floor(y1) + 0.5
    x2 = Math.floor(x2) + 0.5
    y2 = Math.floor(y2) + 0.5
  }

  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

export function drawDashLine (ctx, x1, y1, x2, y2, dashLength = 5) {
  const xpos = x2 - x1    // 横向的宽度
  const ypos = y2 - y1    // 纵向的高度
  const numDashes = Math.floor(Math.sqrt(xpos * xpos + ypos * ypos) / dashLength)

  // 利用正切获取斜边的长度除以虚线长度，得到要分为多少段
  for (var i = 0; i < numDashes; i++) {
    if (i % 2 === 0) {
      // 有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
      ctx.moveTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
    } else {
      ctx.lineTo(x1 + (xpos / numDashes) * i, y1 + (ypos / numDashes) * i)
    }
  }

  ctx.stroke()
}

/** 图表 */
export default class Chart {
  constructor (canvas, data = [], xAccessor = IDENTITY, yAccessor = IDENTITY) {
    if (typeof canvas === 'string') {
      this.ctx = wx.createCanvasContext(canvas)
    } else {
      this.ctx = canvas
    }

    this.xAccessor = xAccessor
    this.yAccessor = yAccessor

    // 根据当前可视区域大小和字体大小计算一个 16:9 的绘图区域
    const res = wx.getSystemInfoSync()
    const width = res.windowWidth
    const height = Math.round(width / CANVAS_RATIO)
    const padding = CANVAS_PADDINGS[state.fontSize]

    this.rect = {
      width,
      height,
      top: padding.top,
      left: padding.left,
      right: width - padding.right,
      bottom: height - padding.bottom
    }

    // 保证绘制的线条是细的
    this.ctx.setLineWidth(1)

    // 初始化比例尺
    this.xScale = d3.scaleTime().range([this.rect.left, this.rect.right])
    this.yScale = d3.scaleLinear().range([this.rect.bottom - LEFT_AXIS_BOTTOM_PADDING, this.rect.top])

    // 更新绘制数据
    this.setData(data)
  }

  /** 更新绘制数据 */
  setData (data, update = true) {
    this.data = data

    if (update) {
      this.updateXScale()
      this.updateYScale()
      this.updateLinearRegression()
    }
  }

  /** 更新横坐标比例尺 */
  updateXScale (xDomain = d3.extent(this.data, this.xAccessor)) {
    this.xScale.domain(xDomain).nice()
  }

  /** 更新纵坐标比例尺 */
  updateYScale (yDomain = d3.extent(this.data, this.yAccessor)) {
    this.yScale.domain(yDomain).nice(yTicksCount)
  }

  /** 更新线性回归线数据 */
  updateLinearRegression () {
    const points = this.data.map(item => [this.xScale(this.xAccessor(item)), this.yScale(this.yAccessor(item))])
    this.linearRegression = linearRegression(points)
  }

  /** 绘制刻度在左侧的纵坐标轴 */
  drawAxisLeft (tickFormatter = IDENTITY, skipFirstTick = false) {
    const fontSize = CHART_FONT_SIZES[state.fontSize]

    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('right')
    this.ctx.setTextBaseline('middle')

    // 绘制坐标轴线
    drawLine(this.ctx, this.rect.left, this.rect.bottom, this.rect.left, this.rect.top)

    // 绘制刻度
    const yTicks = this.yScale.ticks(yTicksCount).slice(skipFirstTick ? 1 : 0)
    yTicks.forEach(yTickValue => {
      const x = this.rect.left
      const y = this.yScale(yTickValue)

      drawLine(this.ctx, x, y, x - TICK_SIZE, y)
      this.ctx.fillText(tickFormatter(yTickValue), x - LEFT_TICKS_MARGIN, y)
    })
  }

  /** 绘制刻度在底部的横坐标轴 */
  drawAxisBottom (tickFormatter = IDENTITY) {
    const fontSize = CHART_FONT_SIZES[state.fontSize]
    const xTicksCount = 3 + Math.round(canvasSizeScale(this.rect.right - this.rect.left)) - Math.round(fontSizeScale(fontSize))

    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('center')
    this.ctx.setTextBaseline('top')

    // 绘制坐标轴线
    drawLine(this.ctx, this.rect.left, this.rect.bottom, this.rect.right, this.rect.bottom)

    // 保证刻度数不超过天数
    let xTicks = this.xScale.ticks(xTicksCount)
    let dayStart = +this.xScale.domain()[0]
    let dayEnd = +this.xScale.domain()[1]
    let days = Math.floor((dayEnd - dayStart) / 24 / 60 / 60 / 1000)

    if (days < xTicks.length) {
      xTicks = []
      for (let date = dayStart; date <= dayEnd; date += 24 * 60 * 60 * 1000) {
        xTicks.push(date)
      }
    }

    // 绘制刻度
    xTicks.forEach(xTickValue => {
      const x = this.xScale(xTickValue)
      const y = this.rect.bottom

      drawLine(this.ctx, x, y, x, y + TICK_SIZE)
      this.ctx.fillText(tickFormatter(xTickValue), x, y + BOTTOM_TICKS_MARGIN)
    })
  }

  /** 绘制数据曲线 */
  drawDataLine () {
    const line = d3.line().curve(d3.curveCatmullRom).x(d => this.xScale(this.xAccessor(d))).y(d => this.yScale(this.yAccessor(d)))
    line.context(this.ctx)(this.data)
    this.ctx.stroke()
  }

  drawDataPoints (fill = 'black', stroke = 'white') {
    this.draw(() => {
      this.ctx.setFillStyle(fill)
      this.ctx.setStrokeStyle(stroke)
      this.ctx.setLineWidth(2)

      this.data.forEach(d => {
        const x = Math.floor(this.xScale(this.xAccessor(d))) + 0.5
        const y = Math.floor(this.yScale(this.yAccessor(d))) + 0.5

        this.ctx.beginPath()
        this.ctx.arc(x, y, 3, 0, 2 * Math.PI)
        this.ctx.stroke()
        this.ctx.fill()
      })
    })
  }

  /** 绘制线性回归线 */
  drawLinearRegression () {
    const [x1, x2] = this.xScale.range()
    const y1 = this.linearRegression.m * x1 + this.linearRegression.b
    const y2 = this.linearRegression.m * x2 + this.linearRegression.b

    this.draw()
    this.draw(() => {
      this.ctx.setStrokeStyle('#D32F2F')
      drawDashLine(this.ctx, x1, y1, x2, y2)
    })
  }

  /** 执行绘制 */
  draw (func, reserve = true) {
    if (typeof func === 'function') {
      this.ctx.save()
      func()
      this.ctx.restore()
    }

    this.ctx.draw(reserve)
    this.ctx.setLineWidth(1)
  }

  /** 清空画布 */
  clear () {
    this.ctx.clearActions()
    this.ctx.draw()
    this.ctx.setLineWidth(1)
  }
}
