'use strict'

import state from './state'
import { FONT_SIZES, CANVAS_PADDINGS } from './constants'

import * as d3Array from 'd3-array'
import * as d3Scale from 'd3-scale'
import * as d3Shape from 'd3-shape'

const d3 = Object.assign({}, d3Array, d3Scale, d3Shape)

const TICK_SIZE = 4
const LEFT_TICKS_MARGIN = 8
const BOTTOM_TICKS_MARGIN = 6
const IDENTITY = a => a

// 用于决定坐标轴上有多少个 tick 要显示出来
const canvasSizeScale = d3.scaleLinear().domain([220, 325]).range([0, 2]).clamp(true)
const fontSizeScale = d3.scaleLinear().domain([14, 20]).range([0, 1]).clamp(true)
const yTicksCount = 4

/** 绘制直线 */
export function drawLine (ctx, x1, y1, x2, y2) {
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

/** 图表 */
export default class Graph {
  constructor (canvas, data = [], xAccessor = IDENTITY, yAccessor = IDENTITY) {
    this.ctx = wx.createCanvasContext('weight-chart')
    this.data = data
    this.xAccessor = xAccessor
    this.yAccessor = yAccessor

    // 保证绘制的线条是细的
    this.ctx.setLineWidth(1)

    // 根据当前可视区域大小和字体大小计算一个 16:9 的绘图区域
    const res = wx.getSystemInfoSync()
    const width = res.windowWidth - 12 * 2
    const height = Math.round(width / 16 * 9)
    const padding = CANVAS_PADDINGS[state.fontSize]

    this.rect = {
      width,
      height,
      top: padding.top,
      left: padding.left,
      right: width - padding.right,
      bottom: height - padding.bottom
    }

    // 计算显示比例
    const xDomain = d3.extent(data, xAccessor)
    const yDomain = d3.extent(data, yAccessor)
    yDomain[0] -= (yDomain[1] - yDomain[0]) / 10

    this.xScale = d3.scaleTime().domain(xDomain).range([this.rect.left, this.rect.right])
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.rect.bottom, this.rect.top])
  }

  /** 绘制刻度在左侧的纵坐标轴 */
  drawAxisLeft (tickFormatter = IDENTITY, skipFirstTick = false) {
    const fontSize = FONT_SIZES[state.fontSize]

    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('right')

    // 绘制坐标轴线
    drawLine(this.ctx, this.rect.left, this.rect.bottom, this.rect.left, this.rect.top)

    // 绘制刻度
    const yTicks = this.yScale.ticks(yTicksCount).slice(skipFirstTick ? 1 : 0)
    yTicks.forEach(yTickValue => {
      const x = this.rect.left
      const y = this.yScale(yTickValue)

      drawLine(this.ctx, x, y, x - TICK_SIZE, y)
      this.ctx.fillText(tickFormatter(yTickValue), x - LEFT_TICKS_MARGIN, y + fontSize / 2 - 1)
    })
  }

  /** 绘制刻度在底部的横坐标轴 */
  drawAxisBottom (tickFormatter = IDENTITY) {
    const fontSize = FONT_SIZES[state.fontSize]
    const xTicksCount = 3 + Math.round(canvasSizeScale(this.rect.right - this.rect.left)) - Math.round(fontSizeScale(fontSize))

    this.ctx.setFontSize(fontSize)
    this.ctx.setTextAlign('center')

    // 绘制坐标轴线
    drawLine(this.ctx, this.rect.left, this.rect.bottom, this.rect.right, this.rect.bottom)

    // 绘制刻度
    const xTicks = this.xScale.ticks(xTicksCount)
    xTicks.forEach(xTickValue => {
      const x = this.xScale(xTickValue)
      const y = this.rect.bottom

      drawLine(this.ctx, x, y, x, y + TICK_SIZE)
      this.ctx.fillText(tickFormatter(xTickValue), x, y + fontSize + BOTTOM_TICKS_MARGIN)
    })
  }

  /** 绘制数据曲线 */
  drawDataLine () {
    const line = d3.line().curve(d3.curveCatmullRom).x(d => this.xScale(this.xAccessor(d))).y(d => this.yScale(this.yAccessor(d)))
    line.context(this.ctx)(this.data)
    this.ctx.stroke()
  }

  /** 执行绘制 */
  draw () {
    this.ctx.draw()
  }
}
