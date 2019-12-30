window.addEventListener('load', function(){
    let iw = document.documentElement.clientWidth;
    document.querySelector('html').style.fontSize = iw / 8 + 'px';
    fun.headerBackgroundColor();
    fun.slideShow();
    fun.navSwitch();
    fun.killCountDown();
    fun.scrollNews();
});

fun = {
    headerBackgroundColor: function(){
        let oHeader = document.querySelector('body>header');
        let oSlideShow = document.querySelector('section.slide-show');
        let iH = oSlideShow.clientHeight;
        document.addEventListener('scroll',function(){
            let iTop = document.documentElement.scrollTop;
            // console.log(iTop);
            // if(iTop === 0){
                oHeader.style.backgroundColor = 'rgba(228, 49, 48,'+ iTop/iH +')';
            // }else{
            //     oHeader.style.backgroundColor = 'rgba(228, 49, 48, 1)';
            // }
        });
    },
    slideShow: function(){
        // 获取轮播图列表和轮播图点点
        let oUl = document.querySelector('section.slide-show > ul');
        let dots = document.querySelectorAll('section.slide-show > ol.dots > li');
        // 克隆ul里最后一个li放在列表最前面，克隆ul里第一个li放在列表最后面，以实现在轮播和滑动的时候可以无缝连接
        let lastLi = oUl.children[0].cloneNode(true);
        let firstLi = oUl.children[oUl.children.length - 1].cloneNode(true);
        oUl.appendChild(lastLi);
        oUl.insertBefore(firstLi,oUl.children[0]);
        // 获取一屏的宽度
        let iW = document.documentElement.clientWidth;
        // 定义一个全局变量用来标记当前的li为第几个
        let n = 1;
        // 让当前列表显示第二个li（旧列表中第一个）
        oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
        // 设置定时器，每两秒改变一次ul的位置
        let timer = setInterval(function(){
            n++;
            oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
            oUl.style.transition = 'all 0.5s';
        },2000);
        // 添加过渡完成事件transitionend，监听ul的位置状态
        // 当ul滚动到最后一个li的时候，把它切换到第二个li（旧列表中的第一个），并且取消过渡
        oUl.addEventListener('transitionend',function(){
            if(n > dots.length){
                n = 1;
                oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
                oUl.style.transition = 'none';
            }else if(n === 0){
                n = dots.length;
                oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
                oUl.style.transition = 'none';
            }
            console.log(n);
            //给与图片相应的dot添加active类，并且清除之前的active类
            document.querySelector('section.slide-show > ol.dots > li.active').classList.remove('active');
            dots[n - 1].classList.add('active');
        });
        let startX = 0;  //用于记录手指按下位置的坐标值
        let moveX = 0;  //用于记录手指离开位置的坐标值
        let disX = 0;  //用于记录手指移动的坐标差值
        let isMove = false;  //用于监听手指是否移动
        // 当触摸屏幕时
        oUl.addEventListener('touchstart',function(e){
            // 暂停定时器动作
            clearInterval(timer);
            // console.log(e);
            // 当手指触摸屏幕时，获取初始坐标值
            startX = e.touches[0].clientX;
            // console.log(startx);
        });
        // 当手指在屏幕移动时
        oUl.addEventListener('touchmove',function(e){
            // 改变监听变量
            isMove = true;
            // 当手指移动时，实时获取当前坐标
            moveX = e.touches[0].clientX;
            // 求得当前坐标与初始坐标的差值
            disX = moveX - startX;
            // 根据坐标差值实时改变ul当前的位置,注意取消过渡
            oUl.style.transform = 'translateX(' + (-iW * n + disX) + 'px)';
            oUl.style.transition = 'none';
        });
        // 当手指离开屏幕时
        oUl.addEventListener('touchend',function(){
            // 如果发生了触摸移动事件
            if(isMove){
                //切换到哪一张图片（也就是改变ul的位置）只与n值有关，所以只需改变n的值就可以控制切换到哪一张图片
                // 如果滑动距离大于屏幕宽1/3
                if(Math.abs(disX) > iw / 3){
                    // 如果滑动距离为正，向右滑动，切换到上一张图片
                    if(disX > 0){
                        n--;
                    }else{   // 如果滑动距离为负，向左滑动，切换到下一张图片
                        n++;
                    }
                }
                oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
                oUl.style.transition = 'all 0.5s';
            }
            //恢复定时器动作
            timer = setInterval(function(){
                n++;
                oUl.style.transform = 'translateX(' + (-iW * n) + 'px)';
                oUl.style.transition = 'all 0.5s';
            },2000);
            // 还原监听变量，重置坐标值
            isMove = false;
            startX = 0;
            moveX = 0;
            disX = 0;
        });
    },
    navSwitch: function(){
        // 获取导航列表和点点
        let oNav = document.querySelector('nav > section.nav-wrap');
        let dots = document.querySelectorAll('nav > ol > li');
        // 获取一屏的宽度
        let iW = document.documentElement.clientWidth;
        let startX = 0;  //用于记录手指按下位置的坐标值
        let moveX = 0;  //用于记录手指离开位置的坐标值
        let disX = 0;  //用于记录手指移动的坐标差值
        let isMove = false;  //用于监听手指是否移动
        let page = 1;  //记录当前导航列表的页数
        // 当触摸屏幕时
        oNav.addEventListener('touchstart',function(e){
            // 当手指触摸屏幕时，获取初始坐标值
            startX = e.touches[0].clientX;
        });
        // 当手指在屏幕移动时
        oNav.addEventListener('touchmove',function(e){
            // 改变监听变量
            isMove = true;
            // 当手指移动时，实时获取当前坐标
            moveX = e.touches[0].clientX;
            // 求得当前坐标与初始坐标的差值
            disX = moveX - startX;
            // 根据坐标差值实时改变ul当前的位置,注意取消过渡
            oNav.style.transform = 'translateX(' + (-iW * (page - 1) + disX) + 'px)';
            oNav.style.transition = 'none';
        });
        // 当手指离开屏幕时
        oNav.addEventListener('touchend',function(){
            // 如果发生了触摸移动事件
            if(isMove){
                //切换到哪一张图片（也就是改变ul的位置）只与n值有关，所以只需改变n的值就可以控制切换到哪一张图片
                // 如果滑动距离大于屏幕宽1/4
                if(Math.abs(disX) > iw / 4){
                    // 手指向左滑动时，并且当前为第一页，则切换到下一页
                    if( page === 1 && disX < 0){
                        page = 2;
                    }else if( page === 2 && disX > 0){   // 手指向右滑动时，并且当前为第二页，则切换到上一页
                        page = 1;
                    }
                }
                oNav.style.transform = 'translateX(' + (-iW * (page - 1)) + 'px)';
                oNav.style.transition = 'all 0.5s';
            }
            // 还原监听变量，重置坐标值
            isMove = false;
            startX = 0;
            moveX = 0;
            disX = 0;
            // page = 1;
        });
        // 给导航列表添加过渡完成事件，控制显示相应的点点
        oNav.addEventListener('transitionstart',function(){
            document.querySelector('nav > ol > li.active').classList.remove('active');
            dots[page-1].classList.add('active');
        })
    },
    killCountDown: function(){
        // 获取秒杀时间场次标签
        let oSession = document.querySelector('main section.main-kill span.kill-session');
        // 设置秒杀场次为当前时间的小时数
        oSession.innerHTML = toZero(new Date().getHours()) + '点场';
        // 获取秒杀时标签
        let oHour = document.querySelector('main section.main-kill section.kill-countdown:nth-of-type(1)');
        // 获取秒杀分标签
        let oMinutes = document.querySelector('main section.main-kill section.kill-countdown:nth-of-type(2)');
        // 获取秒杀秒标签
        let oSeconds = document.querySelector('main section.main-kill section.kill-countdown:nth-of-type(3)');
        let year = new Date().getFullYear();  //获取当前年份
        let month = new Date().getMonth();  //获取当前月份
        let date = new Date().getDate();  //获取当前日期
        let hour = new Date().getHours();  //获取当前小时数
        //设置倒计时日期为未来一个小时
        let countDownTime = new Date(year,month,date,hour+1);
        let now = new Date().getTime();  //获取当前时间戳
        //获取未来时间距离当前时间的秒数
        let s = (countDownTime.getTime()-now) / 1000;
        console.log(s);
        let timer;
        timer = setInterval(function(){
            s--;
            oHour.innerHTML = toZero(Number.parseInt(s / 3600));
            oMinutes.innerHTML = toZero(Number.parseInt(s % 3600 / 60));
            oSeconds.innerHTML = toZero(Number.parseInt(s % 60));
        },1000);
        if(s <= 0){
            clearInterval(timer);
            return timer();
        }
        function toZero(num){
           return num < 10 ? '0' + num : num;
        }
    },
    scrollNews: function(){
        //获取新闻列表
        let oNewsList = document.querySelector('main section.scroll-news ul');
        // 获取所有新闻
        let aNewsLi = oNewsList.querySelectorAll('li');
        // 获取每条新闻的高度
        let iH = aNewsLi[0].offsetHeight;
        // 克隆第一条新闻添加到新闻列表最后面，以实现无缝滚动
        let lastLi = aNewsLi[0].cloneNode(true);
        oNewsList.appendChild(lastLi);
        // console.log(iH);
        // 用于记录新闻个数
        let n = 0;
        let timer = setInterval(function(){
            n++;
            oNewsList.style.transform = 'translateY(' + (-iH * n) + 'px)';
            oNewsList.style.transition = 'all 0.5s';
        },2000);
        oNewsList.addEventListener('transitionend',function(){
            if(n === aNewsLi.length){
                n = 0;
                oNewsList.style.transform = 'translateY(' + (-iH * n) + 'px)';
                oNewsList.style.transition = 'none';
            }
        })
    },

};