/**
 * 大小周休息日助手 - uTools插件主逻辑
 * @fileoverview uTools插件的核心逻辑，用于显示大小周休息日安排
 * @author Tommy Runner
 * @version 1.0.0
 * @since 2024-12-19
 * @description 该插件支持用户自定义设置第一个单休周的日期，自动计算并显示大小周休息日安排，
 *              支持农历显示、键盘快捷键操作等功能。
 */

// =====================================================================
// 应用常量配置
// =====================================================================

/**
 * 应用核心常量
 * @readonly
 * @namespace APP_CONSTANTS
 */
const APP_CONSTANTS = {
  // 应用信息
  VERSION: '1.0.1',
  APP_NAME: '大小周休息日助手',
  
  // 数据库配置
  DB_CONFIG_KEY: 'weekends_config',
  
  // 默认配置
  DEFAULT_FIRST_SINGLE_WEEK: '2025-07-28',
  
  // 时间计算常量
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
  DAYS_PER_WEEK: 7,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  SECONDS_PER_MINUTE: 60,
  MILLISECONDS_PER_SECOND: 1000,
  
  // 动画和交互时间常量
  ANIMATION_DURATION: 300,
  MESSAGE_DISPLAY_DURATION: 3000,
  MESSAGE_SHOW_DELAY: 100,
  
  // 农历计算基准
  LUNAR_BASE_YEAR: 2000,
  LUNAR_BASE_MONTH: 0,
  LUNAR_BASE_DAY: 6,
  LUNAR_MIN_DAYS_DIFF: -3650,
  DAYS_PER_YEAR: 365,
  DAYS_PER_LUNAR_MONTH: 30,
  
  // 日期格式
  DATE_FORMAT_SEPARATOR: '-',
  
  // 周日在JavaScript中的索引值
  SUNDAY_INDEX: 0,
  MONDAY_OFFSET_FROM_SUNDAY: -6,
};

/**
 * 周类型枚举
 * @readonly
 * @enum {string}
 */
const WEEK_TYPES = {
  /** 单休周（小周）- 周一到周六工作，仅周日休息 */
  SINGLE: 'single',
  /** 双休周（大周）- 周一到周五工作，周六日休息 */
  DOUBLE: 'double'
};

/**
 * 消息类型枚举
 * @readonly
 * @enum {string}
 */
const MESSAGE_TYPES = {
  /** 成功消息 */
  SUCCESS: 'success',
  /** 错误消息 */
  ERROR: 'error',
  /** 警告消息 */
  WARNING: 'warning'
};

/**
 * CSS类名常量
 * @readonly
 * @namespace CSS_CLASSES
 */
const CSS_CLASSES = {
  // 日历相关
  CALENDAR_DAY: 'calendar-day',
  CALENDAR_HEADER: 'calendar-header',
  
  // 状态类
  FADE_IN: 'fade-in',
  OTHER_MONTH: 'other-month',
  TODAY: 'today',
  SELECTED: 'selected',
  CONFIGURED_DATE: 'configured-date',
  HIDDEN: 'hidden',
  
  // 休息日类型
  SINGLE_REST_DAY: 'single-rest-day',
  DOUBLE_REST_DAY: 'double-rest-day',
  WORK_DAY: 'work-day',
  
  // 消息提示
  MESSAGE_TOAST: 'message-toast'
};

/**
 * DOM元素ID常量
 * @readonly
 * @namespace ELEMENT_IDS
 */
const ELEMENT_IDS = {
  // 设置相关
  FIRST_SINGLE_WEEK_INPUT: 'firstSingleWeek',
  SAVE_SETTINGS_BTN: 'saveSettings',
  
  // 日历导航
  CURRENT_MONTH_SPAN: 'currentMonth',
  PREV_MONTH_BTN: 'prevMonth',
  NEXT_MONTH_BTN: 'nextMonth',
  CALENDAR_GRID: 'calendarGrid',
  
  // 日期信息显示
  SELECTED_DATE_SPAN: 'selectedDate',
  LUNAR_DATE_SPAN: 'lunarDate',
  
  // 消息提示
  MESSAGE_TOAST: 'messageToast',
  MESSAGE_TEXT: 'messageText'
};

/**
 * 键盘按键常量
 * @readonly
 * @namespace KEYBOARD_KEYS
 */
const KEYBOARD_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  ESCAPE: 'Escape'
};

/**
 * 农历数据常量
 * @readonly
 * @namespace LUNAR_DATA
 */
const LUNAR_DATA = {
  /** 农历月份名称 */
  MONTHS: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
  
  /** 农历日期名称 */
  DAYS: [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ],
  
  /** 星期名称 */
  WEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
};

/**
 * 用户界面文本常量
 * @readonly
 * @namespace UI_TEXTS
 */
const UI_TEXTS = {
  // 日期显示
  TODAY: '今天',
  YESTERDAY: '昨天',
  TOMORROW: '明天',
  LUNAR_DATE_FALLBACK: '农历日期',
  
  // 消息提示
  INIT_FAILED: '初始化失败，请刷新重试',
  SETTINGS_SAVED: '设置保存成功',
  SETTINGS_SAVE_FAILED: '保存设置失败',
  SETTINGS_LOADED: '设置加载成功',
  SETTINGS_LOAD_FAILED: '加载设置失败',
  DATE_REQUIRED: '请选择第一个单休周的日期',
  UTOOLS_ENV_WARNING: '当前不在uTools环境中，某些功能可能无法正常使用',
  APP_STARTING: '大小周休息日助手正在启动...',
  
  // 错误消息格式
  CALC_WEEK_TYPE_FAILED: '计算周类型失败',
  
  // 日期格式
  MONTH_FORMAT: '月',
  DAY_FORMAT: '日',
  YEAR_FORMAT: '年',
  LUNAR_PREFIX: '农历'
};

// =====================================================================
// 主应用类
// =====================================================================

/**
 * 大小周休息日助手主类
 * @class WeekendsHelper
 * @description 负责处理大小周休息日的计算、显示和用户交互
 * @example
 * // 创建应用实例
 * const helper = new WeekendsHelper();
 * 
 * // 手动设置日期
 * helper.selectDate(new Date('2025-07-28'));
 * 
 * // 获取指定日期的周类型
 * const weekType = helper.getWeekType(new Date('2025-07-28'));
 */
class WeekendsHelper {
  /**
   * 构造函数 - 初始化大小周休息日助手
   * @constructor
   * @description 创建WeekendsHelper实例，初始化DOM元素引用、状态管理和默认配置
   */
  constructor() {
    /**
     * DOM元素引用集合
     * @type {Object.<string, HTMLElement>}
     * @private
     */
    this.elements = this.initializeElements();

    /**
     * 当前显示的月份日期
     * @type {Date}
     * @private
     */
    this.currentDate = new Date();

    /**
     * 当前选中的日期
     * @type {Date}
     * @private
     */
    this.selectedDate = new Date();

    /**
     * 默认配置对象
     * @type {Object}
     * @private
     * @property {string} firstSingleWeek - 第一个单休周的周一日期
     * @property {string} version - 应用版本号
     */
    this.defaultConfig = {
      firstSingleWeek: APP_CONSTANTS.DEFAULT_FIRST_SINGLE_WEEK,
      version: APP_CONSTANTS.VERSION
    };

    // 启动应用初始化流程
    this.init();
  }

  /**
   * 初始化DOM元素引用
   * @private
   * @returns {Object.<string, HTMLElement>} DOM元素引用对象
   * @description 获取所有需要的DOM元素引用，如果元素不存在则记录警告
   */
  initializeElements() {
    const elements = {};
    
    // 批量获取DOM元素
    Object.entries(ELEMENT_IDS).forEach(([key, id]) => {
      const element = document.getElementById(id);
      if (!element) {
        console.warn(`DOM元素未找到: ${id}`);
      }
      // 转换为驼峰命名
      const camelCaseKey = key.toLowerCase().split('_').map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      elements[camelCaseKey] = element;
    });

    return elements;
  }

  /**
   * 初始化应用
   * @async
   * @public
   * @returns {Promise<void>}
   * @description 异步初始化应用，包括加载设置、绑定事件、更新日历等
   * @throws {Error} 当初始化过程中发生错误时抛出
   */
  async init() {
    try {
      await this.loadSettings();
      this.bindEvents();
      this.updateCalendar();
      this.updateSelectedDateInfo();
    } catch (error) {
      console.error(UI_TEXTS.INIT_FAILED, error);
      this.showMessage(UI_TEXTS.INIT_FAILED, MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * 绑定事件监听器
   * @private
   * @returns {void}
   * @description 为各种UI元素绑定相应的事件处理器，包括按钮点击和键盘快捷键
   */
  bindEvents() {
    // 月份导航按钮事件
    if (this.elements.prevMonthBtn) {
      this.elements.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
    }
    
    if (this.elements.nextMonthBtn) {
      this.elements.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
    }

    // 设置保存按钮事件
    if (this.elements.saveSettingsBtn) {
      this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
    }

    // 全局键盘快捷键
    document.addEventListener('keydown', (event) => this.handleKeyboard(event));
  }

  /**
   * 简化的农历转换函数
   * @public
   * @param {Date} date - 需要转换的公历日期
   * @returns {string} 格式化的农历日期字符串
   * @description 将公历日期转换为农历显示格式，基于2000年基准进行简化计算
   * @example
   * const lunar = helper.toLunar(new Date('2025-07-28'));
   * console.log(lunar); // "农历2025年七月初一"
   */
  toLunar(date) {
    // 基于基准日期进行简化的农历计算
    const baseDate = new Date(
      APP_CONSTANTS.LUNAR_BASE_YEAR, 
      APP_CONSTANTS.LUNAR_BASE_MONTH, 
      APP_CONSTANTS.LUNAR_BASE_DAY
    );
    const daysDiff = Math.floor((date - baseDate) / APP_CONSTANTS.MILLISECONDS_PER_DAY);

    // 处理过早的日期
    if (daysDiff < APP_CONSTANTS.LUNAR_MIN_DAYS_DIFF) {
      return UI_TEXTS.LUNAR_DATE_FALLBACK;
    }

    // 计算农历年月日
    const lunarYear = APP_CONSTANTS.LUNAR_BASE_YEAR + 
                     Math.floor(Math.abs(daysDiff) / APP_CONSTANTS.DAYS_PER_YEAR);
    const yearDay = Math.abs(daysDiff) % APP_CONSTANTS.DAYS_PER_YEAR;
    const lunarMonth = Math.floor(yearDay / APP_CONSTANTS.DAYS_PER_LUNAR_MONTH) + 1;
    const lunarDay = (yearDay % APP_CONSTANTS.DAYS_PER_LUNAR_MONTH) + 1;

    // 格式化农历显示
    const monthStr = LUNAR_DATA.MONTHS[Math.min(lunarMonth - 1, LUNAR_DATA.MONTHS.length - 1)] + 
                    UI_TEXTS.MONTH_FORMAT;
    const dayStr = LUNAR_DATA.DAYS[Math.min(lunarDay - 1, LUNAR_DATA.DAYS.length - 1)];

    return `${UI_TEXTS.LUNAR_PREFIX}${lunarYear}${UI_TEXTS.YEAR_FORMAT}${monthStr}${dayStr}`;
  }

  /**
   * 判断指定日期是单休周还是双休周
   * @public
   * @param {Date} date - 要判断的日期
   * @returns {string} 返回周类型：'single' 或 'double'
   * @description 基于用户设置的第一个单休周日期，计算指定日期所在周的类型
   * @example
   * const weekType = helper.getWeekType(new Date('2025-07-28'));
   * console.log(weekType); // "single" 或 "double"
   */
  getWeekType(date) {
    try {
      const firstSingleWeekStr = this.elements.firstSingleWeekInput?.value;
      if (!firstSingleWeekStr) {
        return WEEK_TYPES.DOUBLE;
      }

      // 手动解析日期以避免时区问题
      const [year, month, day] = firstSingleWeekStr
        .split(APP_CONSTANTS.DATE_FORMAT_SEPARATOR)
        .map(Number);
      const firstSingleWeek = new Date(year, month - 1, day);
      
      const targetMonday = this.getMondayOfWeek(date);
      const firstSingleWeekMonday = this.getMondayOfWeek(firstSingleWeek);

      // 计算周数差
      const daysDiff = Math.floor(
        (targetMonday - firstSingleWeekMonday) / APP_CONSTANTS.MILLISECONDS_PER_DAY
      );
      const weeksDiff = Math.floor(daysDiff / APP_CONSTANTS.DAYS_PER_WEEK);

      // 偶数周是单休周，奇数周是双休周
      return weeksDiff % 2 === 0 ? WEEK_TYPES.SINGLE : WEEK_TYPES.DOUBLE;
    } catch (error) {
      console.error(UI_TEXTS.CALC_WEEK_TYPE_FAILED, error);
      return WEEK_TYPES.DOUBLE;
    }
  }

  /**
   * 获取指定日期所在周的周一
   * @public
   * @param {Date} date - 指定日期
   * @returns {Date} 该周的周一日期
   * @description 计算给定日期所在星期的周一日期，周日特殊处理
   * @example
   * const monday = helper.getMondayOfWeek(new Date('2025-07-30')); // 周三
   * console.log(monday); // 2025-07-28 (周一)
   */
  getMondayOfWeek(date) {
    const day = date.getDay();
    const mondayOffset = day === APP_CONSTANTS.SUNDAY_INDEX ? 
                        APP_CONSTANTS.MONDAY_OFFSET_FROM_SUNDAY : 
                        1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    return monday;
  }

  /**
   * 判断指定日期是否为休息日
   * @public
   * @param {Date} date - 要判断的日期
   * @returns {boolean} 是否为休息日
   * @description 根据周类型判断指定日期是否为休息日
   * @example
   * const isRest = helper.isRestDay(new Date('2025-07-27')); // 周日
   * console.log(isRest); // true (单休周或双休周都休息)
   */
  isRestDay(date) {
    const day = date.getDay();
    const weekType = this.getWeekType(date);

    if (weekType === WEEK_TYPES.SINGLE) {
      return day === APP_CONSTANTS.SUNDAY_INDEX; // 单休周只有周日休息
    } else {
      return day === APP_CONSTANTS.SUNDAY_INDEX || day === 6; // 双休周周六日都休息
    }
  }

  /**
   * 判断指定日期是否是设置的第一个单休周日期
   * @public
   * @param {Date} date - 要判断的日期
   * @returns {boolean} 是否是配置的日期
   * @description 检查指定日期是否与用户设置的第一个单休周日期相同
   * @example
   * const isConfigured = helper.isConfiguredDate(new Date('2025-07-28'));
   * console.log(isConfigured); // true (如果设置的就是这个日期)
   */
  isConfiguredDate(date) {
    try {
      const firstSingleWeekStr = this.elements.firstSingleWeekInput?.value;
      if (!firstSingleWeekStr) {
        return false;
      }

      // 手动解析日期以避免时区问题
      const [year, month, day] = firstSingleWeekStr
        .split(APP_CONSTANTS.DATE_FORMAT_SEPARATOR)
        .map(Number);
      const firstSingleWeek = new Date(year, month - 1, day);
      
      return this.isSameDay(date, firstSingleWeek);
    } catch (error) {
      return false;
    }
  }

  /**
   * 更新日历显示
   * @public
   * @returns {void}
   * @description 重新渲染日历网格，包括月份标题和所有日期元素
   */
  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // 更新月份标题
    if (this.elements.currentMonthSpan) {
      this.elements.currentMonthSpan.textContent = 
        `${year}${UI_TEXTS.YEAR_FORMAT}${month + 1}${UI_TEXTS.MONTH_FORMAT}`;
    }

    // 清空现有日历日期元素
    this.clearCalendarDays();

    // 生成新的日历日期元素
    this.generateCalendarDays(year, month);

    // 安排动画清理
    this.scheduleAnimationCleanup();
  }

  /**
   * 清空日历中的日期元素
   * @private
   * @returns {void}
   * @description 移除日历网格中的所有日期元素，保留表头
   */
  clearCalendarDays() {
    if (!this.elements.calendarGrid) return;
    
    const calendarDays = this.elements.calendarGrid.querySelectorAll(`.${CSS_CLASSES.CALENDAR_DAY}`);
    calendarDays.forEach(day => day.remove());
  }

  /**
   * 生成日历日期元素
   * @private
   * @param {number} year - 年份
   * @param {number} month - 月份（0-11）
   * @returns {void}
   * @description 计算并生成指定年月的所有日历日期元素
   */
  generateCalendarDays(year, month) {
    if (!this.elements.calendarGrid) return;

    // 计算日历布局参数
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const adjustedStartDay = startDay === APP_CONSTANTS.SUNDAY_INDEX ? APP_CONSTANTS.DAYS_PER_WEEK : startDay;
    const totalDays = Math.ceil((lastDay.getDate() + adjustedStartDay - 1) / APP_CONSTANTS.DAYS_PER_WEEK) * 
                     APP_CONSTANTS.DAYS_PER_WEEK;

    // 生成所有日期元素
    for (let i = 0; i < totalDays; i++) {
      const dayOffset = i - adjustedStartDay + 2;
      const currentDay = new Date(year, month, dayOffset);
      const dayElement = this.createDayElement(currentDay, month);
      this.elements.calendarGrid.appendChild(dayElement);
    }
  }

  /**
   * 安排动画清理任务
   * @private
   * @returns {void}
   * @description 在动画完成后移除fade-in类
   */
  scheduleAnimationCleanup() {
    setTimeout(() => {
      if (!this.elements.calendarGrid) return;
      
      const animatedDays = this.elements.calendarGrid.querySelectorAll(`.${CSS_CLASSES.FADE_IN}`);
      animatedDays.forEach(day => day.classList.remove(CSS_CLASSES.FADE_IN));
    }, APP_CONSTANTS.ANIMATION_DURATION);
  }

  /**
   * 创建日历日期元素
   * @private
   * @param {Date} date - 日期对象
   * @param {number} currentMonth - 当前显示的月份（0-11）
   * @returns {HTMLElement} 创建的日期DOM元素
   * @description 创建单个日期元素，包括样式类和事件绑定
   */
  createDayElement(date, currentMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = `${CSS_CLASSES.CALENDAR_DAY} ${CSS_CLASSES.FADE_IN}`;
    dayElement.textContent = date.getDate();

    // 添加日期数据属性用于选择操作
    dayElement.dataset.date = `${date.getFullYear()}${APP_CONSTANTS.DATE_FORMAT_SEPARATOR}${date.getMonth()}${APP_CONSTANTS.DATE_FORMAT_SEPARATOR}${date.getDate()}`;

    // 应用各种样式类
    this.applyDayElementStyles(dayElement, date, currentMonth);

    // 绑定点击事件
    dayElement.addEventListener('click', () => this.selectDate(date));

    return dayElement;
  }

  /**
   * 为日期元素应用样式类
   * @private
   * @param {HTMLElement} dayElement - 日期DOM元素
   * @param {Date} date - 日期对象
   * @param {number} currentMonth - 当前显示的月份（0-11）
   * @returns {void}
   * @description 根据日期状态为元素添加相应的CSS类
   */
  applyDayElementStyles(dayElement, date, currentMonth) {
    const today = new Date();
    const isToday = this.isSameDay(date, today);
    const isSelected = this.isSameDay(date, this.selectedDate);
    const isCurrentMonth = date.getMonth() === currentMonth;
    const isRest = this.isRestDay(date);
    const weekType = this.getWeekType(date);
    const isConfiguredDate = this.isConfiguredDate(date);

    // 添加状态类
    if (!isCurrentMonth) {
      dayElement.classList.add(CSS_CLASSES.OTHER_MONTH);
    }

    if (isToday) {
      dayElement.classList.add(CSS_CLASSES.TODAY);
    }

    if (isSelected) {
      dayElement.classList.add(CSS_CLASSES.SELECTED);
    }

    if (isConfiguredDate) {
      dayElement.classList.add(CSS_CLASSES.CONFIGURED_DATE);
    }

    // 添加工作/休息状态类
    if (isRest) {
      if (weekType === WEEK_TYPES.SINGLE) {
        dayElement.classList.add(CSS_CLASSES.SINGLE_REST_DAY);
      } else {
        dayElement.classList.add(CSS_CLASSES.DOUBLE_REST_DAY);
      }
    } else {
      dayElement.classList.add(CSS_CLASSES.WORK_DAY);
    }
  }

  /**
   * 选择指定日期
   * @public
   * @param {Date} date - 要选择的日期
   * @returns {void}
   * @description 设置指定日期为选中状态并更新相关显示
   */
  selectDate(date) {
    this.selectedDate = new Date(date);
    this.updateCalendarSelection();
    this.updateSelectedDateInfo();
  }

  /**
   * 更新日历选中状态（无动画）
   * @private
   * @returns {void}
   * @description 更新日历中的选中状态标识，不触发重新渲染
   */
  updateCalendarSelection() {
    if (!this.elements.calendarGrid) return;

    const allDays = this.elements.calendarGrid.querySelectorAll(`.${CSS_CLASSES.CALENDAR_DAY}`);
    
    // 移除所有选中状态
    allDays.forEach(day => day.classList.remove(CSS_CLASSES.SELECTED));

    // 添加新的选中状态
    const selectedDateKey = `${this.selectedDate.getFullYear()}${APP_CONSTANTS.DATE_FORMAT_SEPARATOR}${this.selectedDate.getMonth()}${APP_CONSTANTS.DATE_FORMAT_SEPARATOR}${this.selectedDate.getDate()}`;
    allDays.forEach(day => {
      if (day.dataset.date === selectedDateKey) {
        day.classList.add(CSS_CLASSES.SELECTED);
      }
    });
  }

  /**
   * 更新选中日期信息显示
   * @private
   * @returns {void}
   * @description 更新界面上的选中日期和农历信息显示
   */
  updateSelectedDateInfo() {
    if (this.elements.selectedDateSpan) {
      this.elements.selectedDateSpan.textContent = this.formatDate(this.selectedDate);
    }

    if (this.elements.lunarDateSpan) {
      this.elements.lunarDateSpan.textContent = this.toLunar(this.selectedDate);
    }
  }

  /**
   * 格式化日期显示
   * @private
   * @param {Date} date - 要格式化的日期
   * @returns {string} 格式化后的日期字符串
   * @description 将日期格式化为用户友好的显示格式，支持今天、昨天、明天的特殊显示
   */
  formatDate(date) {
    const today = new Date();
    
    if (this.isSameDay(date, today)) {
      return UI_TEXTS.TODAY;
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(date, yesterday)) {
      return UI_TEXTS.YESTERDAY;
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (this.isSameDay(date, tomorrow)) {
      return UI_TEXTS.TOMORROW;
    }

    return `${date.getMonth() + 1}${UI_TEXTS.MONTH_FORMAT}${date.getDate()}${UI_TEXTS.DAY_FORMAT} ${LUNAR_DATA.WEEKDAYS[date.getDay()]}`;
  }

  /**
   * 判断两个日期是否为同一天
   * @public
   * @param {Date} date1 - 第一个日期
   * @param {Date} date2 - 第二个日期
   * @returns {boolean} 是否为同一天
   * @description 比较两个日期对象是否表示同一天（忽略时分秒）
   */
  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * 导航到指定月份
   * @public
   * @param {number} offset - 月份偏移量（正数向后，负数向前）
   * @returns {void}
   * @description 根据偏移量切换显示的月份并更新日历
   */
  navigateMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.updateCalendar();
  }

  /**
   * 跳转到今天
   * @public
   * @returns {void}
   * @description 将日历跳转到当前日期并选中今天
   */
  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.updateCalendar();
    this.updateSelectedDateInfo();
  }

  /**
   * 从存储中加载设置
   * @async
   * @private
   * @returns {Promise<void>}
   * @description 从uTools数据库加载用户设置，如果版本不匹配或失败则使用默认设置
   */
  async loadSettings() {
    try {
      const savedConfig = typeof utools !== 'undefined' ? 
                         utools.db.get(APP_CONSTANTS.DB_CONFIG_KEY) : 
                         null;
      
      let config = this.defaultConfig;
      
      // 检查版本兼容性，如果版本不匹配则使用新的默认设置
      if (savedConfig?.data) {
        const savedVersion = savedConfig.data.version;
        const currentVersion = APP_CONSTANTS.VERSION;
        
        if (savedVersion === currentVersion) {
          // 版本匹配，使用保存的设置
          config = savedConfig.data;
        } else {
          // 版本不匹配，使用默认设置并保存新版本
          console.log(`版本升级: ${savedVersion} -> ${currentVersion}，重置为默认设置`);
          config = this.defaultConfig;
          await this.saveDefaultSettings();
        }
      } else {
        // 没有保存的设置，保存默认设置
        await this.saveDefaultSettings();
      }

      // 应用设置到界面
      if (this.elements.firstSingleWeekInput) {
        this.elements.firstSingleWeekInput.value = 
          config.firstSingleWeek || this.defaultConfig.firstSingleWeek;
      }

      console.log(UI_TEXTS.SETTINGS_LOADED, config);
    } catch (error) {
      console.error(UI_TEXTS.SETTINGS_LOAD_FAILED, error);
      // 使用默认设置
      if (this.elements.firstSingleWeekInput) {
        this.elements.firstSingleWeekInput.value = this.defaultConfig.firstSingleWeek;
      }
    }
  }

  /**
   * 保存默认设置
   * @async
   * @private
   * @returns {Promise<void>}
   * @description 将默认设置保存到存储中
   */
  async saveDefaultSettings() {
    try {
      if (typeof utools !== 'undefined') {
        const config = {
          ...this.defaultConfig,
          lastUpdated: new Date().toISOString()
        };
        
        utools.db.put({
          _id: APP_CONSTANTS.DB_CONFIG_KEY,
          data: config
        });
        
        console.log('默认设置已保存:', config);
      }
    } catch (error) {
      console.error('保存默认设置失败:', error);
    }
  }

  /**
   * 保存设置到存储
   * @async
   * @public
   * @returns {Promise<void>}
   * @description 验证并保存用户设置到uTools数据库，成功后更新界面显示
   */
  async saveSettings() {
    try {
      const config = {
        firstSingleWeek: this.elements.firstSingleWeekInput?.value,
        version: this.defaultConfig.version,
        lastUpdated: new Date().toISOString()
      };

      // 验证必要设置
      if (!config.firstSingleWeek) {
        this.showMessage(UI_TEXTS.DATE_REQUIRED, MESSAGE_TYPES.WARNING);
        return;
      }

      // 保存到uTools数据库
      if (typeof utools !== 'undefined') {
        utools.db.put({
          _id: APP_CONSTANTS.DB_CONFIG_KEY,
          data: config
        });
      }

      // 更新界面显示
      this.updateCalendar();
      this.updateSelectedDateInfo();

      this.showMessage(UI_TEXTS.SETTINGS_SAVED, MESSAGE_TYPES.SUCCESS);
      console.log(UI_TEXTS.SETTINGS_SAVED, config);
    } catch (error) {
      console.error(UI_TEXTS.SETTINGS_SAVE_FAILED, error);
      this.showMessage(UI_TEXTS.SETTINGS_SAVE_FAILED, MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * 处理键盘快捷键
   * @private
   * @param {KeyboardEvent} event - 键盘事件对象
   * @returns {void}
   * @description 处理各种键盘快捷键操作，包括月份导航和应用控制
   */
  handleKeyboard(event) {
    switch (event.key) {
      case KEYBOARD_KEYS.ARROW_LEFT:
        event.preventDefault();
        this.navigateMonth(-1);
        break;
        
      case KEYBOARD_KEYS.ARROW_RIGHT:
        event.preventDefault();
        this.navigateMonth(1);
        break;
        
      case KEYBOARD_KEYS.HOME:
        event.preventDefault();
        this.goToToday();
        break;
        
      case KEYBOARD_KEYS.ESCAPE:
        event.preventDefault();
        if (typeof utools !== 'undefined') {
          utools.hideMainWindow();
        }
        break;
    }
  }

  /**
   * 显示消息提示
   * @public
   * @param {string} message - 消息内容
   * @param {string} [type=MESSAGE_TYPES.SUCCESS] - 消息类型
   * @returns {void}
   * @description 显示临时消息提示，支持成功、错误、警告等不同类型
   */
  showMessage(message, type = MESSAGE_TYPES.SUCCESS) {
    if (!this.elements.messageToast || !this.elements.messageText) {
      return;
    }

    this.elements.messageText.textContent = message;
    this.elements.messageToast.className = `${CSS_CLASSES.MESSAGE_TOAST} ${type}`;

    // 显示消息
    setTimeout(() => {
      this.elements.messageToast.classList.remove(CSS_CLASSES.HIDDEN);
    }, APP_CONSTANTS.MESSAGE_SHOW_DELAY);

    // 自动隐藏
    setTimeout(() => {
      this.elements.messageToast.classList.add(CSS_CLASSES.HIDDEN);
    }, APP_CONSTANTS.MESSAGE_DISPLAY_DURATION);
  }
}

// =====================================================================
// 应用入口点
// =====================================================================

/**
 * 应用初始化入口
 * @description 当DOM加载完成后初始化大小周休息日助手应用
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log(UI_TEXTS.APP_STARTING);

  // 检查uTools环境
  if (typeof utools === 'undefined') {
    console.warn(UI_TEXTS.UTOOLS_ENV_WARNING);
  }

  // 创建应用实例并挂载到全局
  window.weekendsHelper = new WeekendsHelper();
});

// =====================================================================
// 模块导出（供测试使用）
// =====================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WeekendsHelper,
    APP_CONSTANTS,
    WEEK_TYPES,
    MESSAGE_TYPES,
    CSS_CLASSES,
    ELEMENT_IDS,
    KEYBOARD_KEYS,
    LUNAR_DATA,
    UI_TEXTS
  };
} 