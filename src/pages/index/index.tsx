import * as React from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import './index.scss'
import p1 from '../../static/images/1.png'
import p2 from '../../static/images/2.png'
import p3 from '../../static/images/3.png'
import nipple from '../../static/images/zhangai1.png'
import nipple2 from '../../static/images/zhangai2.png'
import mushroom from '../../static/images/flower2.png'
import robot from '../../static/images/flower1.png'
import user from '../../static/images/user.pic.jpg'
import gift1 from '../../static/images/gift1.png'
import gift2 from '../../static/images/gift2.png'
import musicOn from '../../static/images/musicOn.png'
import music from '../../static/images/music.png'
import pause from '../../static/images/pause.png'

export default function Index() {
  let peopleDom: any = null //人物的dom
  let gameBoxDom: any = null //游戏背景dom
  let trackDom: any = null  //track的dom
  let l  //人物的实时动态的位置  60  110  160
  let t  //人物的实时动态的位置  50  100
  let sl = 110  //人物左右结果位置
  let moveSize = 50
  let timer: any = null  //跑步的定时器
  let driveTime: any = null //输出商品的定时器
  let [action, setAction] = React.useState(p1)
  let [score, setScore] = React.useState(100)
  let [showEntrance, setShowEntrance]: any[] = React.useState(true)
  let [audio, setAudio]: any[] = React.useState(null)
  let [listen, setListen] = React.useState(true)

  const giftList = [
    {
      gift: nipple,
      count: 10,
    },
    {
      gift: nipple2,
      count: 10,
    },
    {
      gift: robot,
      count: -5,
    },
    {
      gift: mushroom,
      count: -20,
    },
    {
      gift: gift1,
      count: 50,
    },
    {
      gift: gift2,
      count: 100,
    }
  ]
  const trackList = [
    {
      name: 'track1',
      left: 140
    },
    {
      name: 'track2',
      left: 160
    },
    {
      name: 'track3',
      left: 190
    },
  ]

  React.useEffect(() => {
    //入口
    // init()
    openMusic()
  }, [])
  /**
   * 开启音乐
   */
  function openMusic() {
    let innerAudioContext = Taro.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'https://124.223.162.201:8888/down/KBdnHQBnoKgd'
    setAudio(innerAudioContext)
  }
  /**
   *
   */
  function closeMusic() {
    if (listen) {
      setListen(false)
      audio.pause()
    } else {
      setListen(true)
      audio.play()
    }
  }
  /**
   * 项目初始
   */
  function init() {
    driveTime = setInterval(() => {
      driveGift()
    }, 1000)

    peopleDom = document.querySelector('.people')
    gameBoxDom = document.querySelector('.gameBox')
    trackDom = document.querySelector('.track')

    l = peopleDom.offsetLeft;
    t = peopleDom.offsetTop;
    //监听人物左右移动事件，并使其跳动
    EventUtil.listenTouchDirection(gameBoxDom, true, up, right, down, left)

    run()
  }
  /**
   * 开始游戏，输出gift
   */
  function driveGift() {
    //随机生成元素
    let elId = Math.floor(Math.random() * (giftList.length))
    let trackId = Math.floor(Math.random() * (trackList.length))
    createNipple(trackList[trackId], giftList[elId])
  }
  /**
   * 创建gift
   * @param {string} trackClass  轨道位置  track1 track2 track3
   * @param {Object} elementInfo 元素信息
   */
  function createNipple(trackInfo, elementInfo) {
    let nippleDom: any = document.createElement('img')
    nippleDom.src = elementInfo.gift
    nippleDom.className = trackInfo.name
    trackDom.appendChild(nippleDom)
    let timer = setTimeout(() => {
      nippleDom.style.top = '100px'
      nippleDom.style.left = trackInfo.left + 'px'
      nippleDom.style.width = '30px'
      nippleDom.style.height = '60px'
      nippleDom.style.transition = 'all 3s cubic-bezier(1.5, 1, .5)';
      let timer2 = setInterval(() => {
        let nippleDom: any = document.querySelector(`.${trackInfo.name}`)
        if (!nippleDom) return
        let nippleTop = nippleDom.offsetTop
        //移动到最顶端移除
        if (nippleTop === 100) {
          removeGift(trackDom, nippleDom)
          clearInterval(timer2)
        }
        if (nippleTop > 200 && nippleTop < 250 && t === peopleDom.offsetTop) {
          // console.log(nippleTop);

          if (sl === 60 && trackInfo.name === 'track1') {
            countScore(elementInfo.count)
            removeGift(trackDom, nippleDom)
            clearInterval(timer2)
          }
          if (sl === 110 && trackInfo.name === 'track2') {
            countScore(elementInfo.count)
            removeGift(trackDom, nippleDom)
            clearInterval(timer2)
          }
          if (sl === 160 && trackInfo.name === 'track3') {
            countScore(elementInfo.count)
            removeGift(trackDom, nippleDom)
            clearInterval(timer2)
          }
        }
      }, 100)
    }, 100);
  }
  /**
   * 开始游戏
   */
  function startGame() {
    setShowEntrance(false)
    audio.play()
    init()
  }

  /**
   * 结束游戏
   */
  function endGame() {
    audio.pause()
    //展示开始界面
    setShowEntrance(true)
  }
  /**
   * 计算分数
   */
  function countScore(count) {
    if (count) {
      let res = count + score
      setScore(res)
    }
  }
  /**
   * 移除gift
   */
  function removeGift(trackDom, nippleDom) {
    if (trackDom.contains(nippleDom)) {
      trackDom.removeChild(nippleDom)
    }
  }
  /**
   * 开始跑步
   */
  function run() {
    let n = -1
    timer = setInterval(() => {
      if (n == 1) {
        n = -1
      }
      n++
      let p = [p1, p2]
      setAction(p[n])
    }, 300)
  }
  /**
   * 跳跃动作
   */
  function jump() {
    clearInterval(timer)
    setAction(p3)
    peopleDom.style.top = t - 50 + 'px'
    setTimeout(() => {
      peopleDom.style.top = t + 'px'
      run()
    }, 1000);
  }

  var EventUtil = {
    addHandler: function (element, type, handler) {
      if (element.addEventListener)
        element.addEventListener(type, handler, false);
      else if (element.attachEvent)
        element.attachEvent("on" + type, handler);
      else
        element["on" + type] = handler;
    },
    removeHandler: function (element, type, handler) {
      if (element.removeEventListener)
        element.removeEventListener(type, handler, false);
      else if (element.detachEvent)
        element.detachEvent("on" + type, handler);
      else
        element["on" + type] = handler;
    },
    /**
     * 监听触摸的方向
     * @param target            要绑定监听的目标元素
     * @param isPreventDefault  是否屏蔽掉触摸滑动的默认行为（例如页面的上下滚动，缩放等）
     * @param upCallback        向上滑动的监听回调（若不关心，可以不传，或传false）
     * @param rightCallback     向右滑动的监听回调（若不关心，可以不传，或传false）
     * @param downCallback      向下滑动的监听回调（若不关心，可以不传，或传false）
     * @param leftCallback      向左滑动的监听回调（若不关心，可以不传，或传false）
     */
    listenTouchDirection: function (target, isPreventDefault, upCallback, rightCallback, downCallback, leftCallback) {
      this.addHandler(target, "touchstart", handleTouchEvent);
      this.addHandler(target, "touchend", handleTouchEvent);
      this.addHandler(target, "touchmove", handleTouchEvent);
      var startX;
      var startY;
      function handleTouchEvent(event) {
        switch (event.type) {
          case "touchstart":
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
            break;
          case "touchend":
            var spanX = event.changedTouches[0].pageX - startX;
            var spanY = event.changedTouches[0].pageY - startY;

            if (Math.abs(spanX) > Math.abs(spanY)) {      //认定为水平方向滑动
              if (spanX > 30) {         //向右
                if (rightCallback)
                  rightCallback();
              } else if (spanX < -30) { //向左
                if (leftCallback)
                  leftCallback();
              }
            } else {                                    //认定为垂直方向滑动
              if (spanY > 30) {         //向下
                if (downCallback)
                  downCallback();
              } else if (spanY < -30) {//向上
                if (upCallback)
                  upCallback();
              }
            }

            break;
          case "touchmove":
            //阻止默认行为
            if (isPreventDefault)
              event.preventDefault();
            break;
        }
      }
    }
  };
  /**
   * 处理上下移动的事件
   */
  function up() {
    jump()
  }
  function right() {
    sl += moveSize

    if (sl > 160) {
      sl = 160
      return
    }
    if (sl < 60) {
      sl = 60
      return
    }
    l += moveSize

    peopleDom.style.left = l + 'px'
  }
  function down() {
  }
  function left() {
    sl -= moveSize
    console.log(sl);

    if (sl > 160) {
      sl = 160
      return
    }
    if (sl < 60) {
      sl = 60
      return
    }
    l -= moveSize

    peopleDom.style.left = l + 'px'
  }
  //人物动作集合
  return (
    <View className='index'>
      {
        showEntrance ?
          (
            // 游戏开始界面
            <View className='gameStart'>
              <Button className='start moveImg' onClick={startGame}>开始游戏</Button>
            </View>
          ) : (
            // 开始游戏背景区域
            < View className=' gameBox'>
              {/* 信息栏 */}
              <View className='info' >
                <View className='info-left'>
                  <Image src={user} className='user'></Image>
                  <View>
                    {score}
                  </View>
                </View>
                <View className='info-right' >
                  <Image src={pause} className="pause" onClick={endGame}></Image>
                  <Image src={listen ? musicOn : music} className='user  music' onClick={closeMusic}></Image>
                </View>
              </View >
              {/* 人物 */}
              <Image className='people' src={action} ></Image >
              {/* 轨道 */}
              <View className='track' >
              </View >
            </View >
          )
      }
    </View >
  )
}

