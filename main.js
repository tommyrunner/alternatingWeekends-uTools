/**
 * 大小周休息日助手 - uTools插件主逻辑
 * @fileoverview uTools插件的核心逻辑，用于显示大小周休息日安排
 * @author Tommy Runner
 * @version 1.0.0
 */

class WeekendsHelper {
  constructor() {
    // DOM 元素引用
    this.elements = {
      firstSingleWeekInput: document.getElementById('firstSingleWeek'),
      saveSettingsBtn: document.getElementById('saveSettings'),
      currentMonthSpan: document.getElementById('currentMonth'),
      prevMonthBtn: document.getElementById('prevMonth'),
      nextMonthBtn: document.getElementById('nextMonth'),
      calendarGrid: document.getElementById('calendarGrid'),
      selectedDateSpan: document.getElementById('selectedDate'),
      lunarDateSpan: document.getElementById('lunarDate'),
      messageToast: document.getElementById('messageToast'),
      messageText: document.getElementById('messageText')
    };

    // 当前显示的月份和选中的日期
    this.currentDate = new Date();
    this.selectedDate = new Date();
    
    // 默认配置
    this.defaultConfig = {
      firstSingleWeek: '2025-07-28', // 默认第一个单休周的周一
      version: '1.0.0'
    };

    // 初始化
    this.init();
  }

  /**
   * 初始化应用
   */
  async init() {
    try {
      await this.loadSettings();
      this.bindEvents();
      this.updateCalendar();
      this.updateSelectedDateInfo();
      this.showMessage('大小周助手加载完成', 'success');
    } catch (error) {
      console.error('初始化失败:', error);
      this.showMessage('初始化失败，请刷新重试', 'error');
    }
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 月份导航
    this.elements.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
    this.elements.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));

    // 设置相关
    this.elements.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

    // 键盘快捷键
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * 简化的农历转换函数
   * @param {Date} date - 需要转换的公历日期
   * @returns {string} 格式化的农历日期字符串
   */
  toLunar(date) {
    const lunarMonths = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
    const lunarDays = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
        "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
    
    // 简化的农历计算（基于2000年基准）
    const baseDate = new Date(2000, 0, 6);
    const daysDiff = Math.floor((date - baseDate) / (24 * 60 * 60 * 1000));
    
    if (daysDiff < -3650) return "农历日期";
    
    const lunarYear = 2000 + Math.floor(Math.abs(daysDiff) / 365);
    const yearDay = Math.abs(daysDiff) % 365;
    const lunarMonth = Math.floor(yearDay / 30) + 1;
    const lunarDay = (yearDay % 30) + 1;
    
    const monthStr = lunarMonths[Math.min(lunarMonth - 1, 11)] + "月";
    const dayStr = lunarDays[Math.min(lunarDay - 1, 29)];
    
    return `农历${lunarYear}年${monthStr}${dayStr}`;
  }

  /**
   * 判断指定日期是单休周还是双休周
   * @param {Date} date - 要判断的日期
   * @returns {string} 'single' | 'double'
   */
  getWeekType(date) {
    try {
      const firstSingleWeekStr = this.elements.firstSingleWeekInput.value;
      if (!firstSingleWeekStr) return 'double';

      const firstSingleWeek = new Date(firstSingleWeekStr);
      const targetMonday = this.getMondayOfWeek(date);
      
      // 计算目标周一距离第一个单休周周一的天数
      const daysDiff = Math.floor((targetMonday - firstSingleWeek) / (24 * 60 * 60 * 1000));
      const weeksDiff = Math.floor(daysDiff / 7);
      
      // 偶数周是单休周，奇数周是双休周
      return weeksDiff % 2 === 0 ? 'single' : 'double';
    } catch (error) {
      console.error('计算周类型失败:', error);
      return 'double';
    }
  }

  /**
   * 获取指定日期所在周的周一
   * @param {Date} date - 指定日期
   * @returns {Date} 该周的周一
   */
  getMondayOfWeek(date) {
    const day = date.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day; // 周日是0，需要特殊处理
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    return monday;
  }

  /**
   * 判断指定日期是否为休息日
   * @param {Date} date - 要判断的日期
   * @returns {boolean} 是否为休息日
   */
  isRestDay(date) {
    const day = date.getDay();
    const weekType = this.getWeekType(date);
    
    if (weekType === 'single') {
      return day === 0; // 单休周只有周日休息
    } else {
      return day === 0 || day === 6; // 双休周周六日都休息
    }
  }

  /**
   * 更新日历显示
   */
  updateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // 更新月份标题
    this.elements.currentMonthSpan.textContent = `${year}年${month + 1}月`;
    
    // 清空日历网格，但保留周标题
    const calendarDays = this.elements.calendarGrid.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => day.remove());
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是周几（0=周日，1=周一...）
    const startDay = firstDay.getDay();
    const adjustedStartDay = startDay === 0 ? 7 : startDay; // 调整为周一开始
    
    // 计算需要显示的总天数（包括上个月和下个月的部分日期）
    const totalDays = Math.ceil((lastDay.getDate() + adjustedStartDay - 1) / 7) * 7;
    
    // 生成日历格子
    for (let i = 0; i < totalDays; i++) {
      const dayOffset = i - adjustedStartDay + 2;
      const currentDay = new Date(year, month, dayOffset);
      const dayElement = this.createDayElement(currentDay, month);
      this.elements.calendarGrid.appendChild(dayElement);
    }
  }

  /**
   * 创建日历日期元素
   * @param {Date} date - 日期
   * @param {number} currentMonth - 当前显示的月份
   * @returns {HTMLElement} 日期元素
   */
  createDayElement(date, currentMonth) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = date.getDate();
    
    // 添加样式类
    const today = new Date();
    const isToday = this.isSameDay(date, today);
    const isSelected = this.isSameDay(date, this.selectedDate);
    const isCurrentMonth = date.getMonth() === currentMonth;
    const isRest = this.isRestDay(date);
    const weekType = this.getWeekType(date);
    
    if (!isCurrentMonth) {
      dayElement.classList.add('other-month');
    }
    
    if (isToday) {
      dayElement.classList.add('today');
    }
    
    if (isSelected) {
      dayElement.classList.add('selected');
    }
    
    if (isRest && isCurrentMonth) {
      if (weekType === 'single') {
        dayElement.classList.add('single-rest-day');
      } else {
        dayElement.classList.add('double-rest-day');
      }
    } else if (isCurrentMonth) {
      dayElement.classList.add('work-day');
    }
    
    // 添加点击事件
    dayElement.addEventListener('click', () => {
      this.selectDate(date);
    });
    
    return dayElement;
  }

  /**
   * 选择日期
   * @param {Date} date - 选中的日期
   */
  selectDate(date) {
    this.selectedDate = new Date(date);
    this.updateCalendar();
    this.updateSelectedDateInfo();
  }

  /**
   * 更新选中日期信息
   */
  updateSelectedDateInfo() {
    // 格式化选中日期
    const dateStr = this.formatDate(this.selectedDate);
    this.elements.selectedDateSpan.textContent = dateStr;
    
    // 显示农历信息
    const lunarStr = this.toLunar(this.selectedDate);
    this.elements.lunarDateSpan.textContent = lunarStr;
  }

  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @returns {string} 格式化的日期字符串
   */
  formatDate(date) {
    const today = new Date();
    if (this.isSameDay(date, today)) {
      return '今天';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (this.isSameDay(date, yesterday)) {
      return '昨天';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (this.isSameDay(date, tomorrow)) {
      return '明天';
    }
    
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
  }

  /**
   * 判断两个日期是否为同一天
   * @param {Date} date1 - 日期1
   * @param {Date} date2 - 日期2
   * @returns {boolean} 是否为同一天
   */
  isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * 导航到指定月份
   * @param {number} offset - 月份偏移量
   */
  navigateMonth(offset) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.updateCalendar();
  }

  /**
   * 跳转到今天
   */
  goToToday() {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.updateCalendar();
    this.updateSelectedDateInfo();
  }

  /**
   * 加载设置
   */
  async loadSettings() {
    try {
      // 从uTools数据库获取设置
      const savedConfig = utools.db.get('weekends_config');
      const config = savedConfig ? savedConfig.data : this.defaultConfig;
      
      // 应用设置
      this.elements.firstSingleWeekInput.value = config.firstSingleWeek || this.defaultConfig.firstSingleWeek;
      
      console.log('设置加载成功:', config);
    } catch (error) {
      console.error('加载设置失败:', error);
      // 使用默认设置
      this.elements.firstSingleWeekInput.value = this.defaultConfig.firstSingleWeek;
    }
  }

  /**
   * 保存设置
   */
  async saveSettings() {
    try {
      const config = {
        firstSingleWeek: this.elements.firstSingleWeekInput.value,
        version: this.defaultConfig.version,
        lastUpdated: new Date().toISOString()
      };
      
      // 验证设置
      if (!config.firstSingleWeek) {
        this.showMessage('请选择第一个单休周的日期', 'warning');
        return;
      }
      
      // 保存到uTools数据库
      utools.db.put({
        _id: 'weekends_config',
        data: config
      });
      
      // 更新显示
      this.updateCalendar();
      this.updateSelectedDateInfo();
      
      this.showMessage('设置保存成功', 'success');
      console.log('设置保存成功:', config);
    } catch (error) {
      console.error('保存设置失败:', error);
      this.showMessage('保存设置失败', 'error');
    }
  }

  /**
   * 处理键盘快捷键
   * @param {KeyboardEvent} event - 键盘事件
   */
  handleKeyboard(event) {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.navigateMonth(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.navigateMonth(1);
        break;
      case 'Home':
        event.preventDefault();
        this.goToToday();
        break;
      case 'Escape':
        event.preventDefault();
        // 关闭uTools窗口
        if (typeof utools !== 'undefined') {
          utools.hideMainWindow();
        }
        break;
    }
  }

  /**
   * 显示消息提示
   * @param {string} message - 消息内容
   * @param {string} type - 消息类型 success|error|warning
   */
  showMessage(message, type = 'success') {
    this.elements.messageText.textContent = message;
    this.elements.messageToast.className = `message-toast ${type}`;
    
    // 显示消息
    setTimeout(() => {
      this.elements.messageToast.classList.remove('hidden');
    }, 100);
    
    // 3秒后隐藏
    setTimeout(() => {
      this.elements.messageToast.classList.add('hidden');
    }, 3000);
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  console.log('大小周休息日助手正在启动...');
  
  // 检查uTools环境
  if (typeof utools === 'undefined') {
    console.warn('当前不在uTools环境中，某些功能可能无法正常使用');
  }
  
  // 创建应用实例
  window.weekendsHelper = new WeekendsHelper();
});

// 导出类供测试使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WeekendsHelper;
} 