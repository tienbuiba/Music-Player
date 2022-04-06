const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');


const app = {

  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [{
    name: 'Hoa Hải Đường',
    singer: 'Jack',
    path: './assets/music/hoa-hai-duong.mp3',
    image: './assets/image/hoa-hai-duong.jpeg'
  },
  {
    name: 'Khuê Mộc Lan',
    singer: 'Xuân Tùng',
    path: './assets/music/khue-moc-lang.mp3',
    image: './assets/image/khue-moc-lang.jpeg'
  },
  {
    name: 'Rồi Tới Luôn',
    singer: 'Jack',
    path: './assets/music/roi-toi-luon.mp3',
    image: './assets/image/roi-toi-luon.jpeg'
  },
  {
    name: 'Sầu Hồng Gai',
    singer: 'Jack',
    path: './assets/music/sau-hong-gai.mp3',
    image: './assets/image/sau-hong-gai.jpeg'
  },
  {
    name: 'Thiên Đàng',
    singer: 'Jack',
    path: './assets/music/thien-dang.mp3',
    image: './assets/image/thien-dang.jpeg'
  },
  {
    name: 'Thương Nhau Tới Bến',
    singer: 'Jack',
    path: './assets/music/thuong-nhau-toi-ben.mp3',
    image: './assets/image/thuong-nhau-toi-ben.jpeg'
  },
  {
    name: 'Y Chang Xuân Sang',
    singer: 'Jack',
    path: './assets/music/y-chang-xuan-sang.mp3',
    image: './assets/image/y-chang-xuan-sang.jpeg'
  }
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
        
        `
    })

    $('.playlist').innerHTML = htmls.join('')



  }, defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })


  }
  ,
  handleEvent: function () {

    const cdWidth = cd.offsetWidth

    //xu ly CD quay/ dung
    const cdThumAnimate = cdThumb.animate([
      {
        transform: 'rotate(360deg)'
      }
    ], {
      duration: 10000,
      interactions: Infinity
    })

    cdThumAnimate.pause()


    //su ly phong to vs thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth
    }
    //Xu ly khi click play
    playBtn.onclick = function () {

      if (app.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    //khi song is played
    audio.onplay = function () {
      app.isPlaying = true
      player.classList.add('playing')
      cdThumAnimate.play()
    }

    //khi song bi pause
    audio.onpause = function () {
      app.isPlaying = false
      player.classList.remove("playing")
      cdThumAnimate.pause()
    }
    //khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }
    //xu ly khi tua
    progress.onchange = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    //khi next bai
    nextBtn.onclick = function () {

      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render()
      app.scrollToActiveSong();

    }

    //khi pre bai
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();

      }
      audio.play();
      app.render();
      app.scrollToActiveSong();

    }
    //random
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
      app.playRandomSong();
      audio.play();
    }

    //xu ly phat lai mot song
    repeatBtn.onclick = function (e) {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);


    }

    //xu ly next song khi audio player den het
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click()
      }
    }

    //lang nghe hanh vi click vaoo playlist
    playlist.onclick = function (e) {
    if(
      e.target.closest('.song:not(.active') || e.target.closest('.option')
      
      ){
      console.log(e.target)

    }

    }


  },
scrollToActiveSong: function () {

  setTimeout(()=> {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'

    },300)

  })

},


  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  }
  ,
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()

  },
  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }
    while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong();
  },
  start: function () {

    //dinh nghia cac thuoc tinh cho object
    this.defineProperties();

    //lang nghe va xu ly cac su kien Dom event
    this.handleEvent();

    //tai thong tin bai hat dau tien vao ui khi chay ung dung
    this.loadCurrentSong();

    //Render playlist
    this.render();

  }
}
app.start();