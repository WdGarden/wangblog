<template>
  <div class="nav-music-player">
    <button class="music-icon" @click="togglePanel" :class="{ active: panelVisible }" title="音乐播放器">
      <svg t="1776298890922" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5072" width="40" height="40"><path d="M513.068522 513.628224m-508.819876 0a508.819876 508.819876 0 1 0 1017.639752 0 508.819876 508.819876 0 1 0-1017.639752 0Z" fill="#F8E71C" p-id="5073"></path><path d="M513.068522 513.628224m-355.442485 0a355.442484 355.442484 0 1 0 710.884969 0 355.442484 355.442484 0 1 0-710.884969 0Z" fill="#2283F6" p-id="5074"></path><path d="M768.470658 845.346981H257.672745c-42.149366 0-76.322981-34.167255-76.322981-76.322981v-510.791553c0-42.155727 34.173615-76.322981 76.322981-76.322981h510.791553c42.155727 0 76.322981 34.167255 76.322982 76.322981v510.791553c0 42.155727-34.167255 76.322981-76.322982 76.322981z" fill="#FFFFFF" p-id="5075"></path><path d="M513.068522 526.34872m-250.11677 0a250.11677 250.11677 0 1 0 500.23354 0 250.11677 250.11677 0 1 0-500.23354 0Z" fill="#FE3D50" p-id="5076"></path><path d="M513.068522 513.628224m-250.11677 0a250.11677 250.11677 0 1 0 500.23354 0 250.11677 250.11677 0 1 0-500.23354 0Z" fill="#FE3D50" p-id="5077"></path><path d="M394.418087 451.870211c22.311752-42.772671 67.06882-71.972571 118.650435-71.972571M330.802882 448.906335c26.624-74.955528 98.176795-128.636025 182.26564-128.636024" fill="" p-id="5078"></path><path d="M513.068522 513.628224m-85.717069 0a85.717068 85.717068 0 1 0 171.434137 0 85.717068 85.717068 0 1 0-171.434137 0Z" fill="#FFFFFF" p-id="5079"></path><path d="M513.068522 513.628224m-75.209938 0a75.209938 75.209938 0 1 0 150.419876 0 75.209938 75.209938 0 1 0-150.419876 0Z" fill="#51E4C2" p-id="5080"></path><path d="M712.303304 258.938435v215.644223a76.322981 76.322981 0 0 1-27.081938 58.310758l-44.954236 37.970683" fill="" p-id="5081"></path><path d="M669.765963 573.255553l-41.850435 33.811081a12.720497 12.720497 0 0 1-17.885019-1.901715l-10.49441-12.987627a12.720497 12.720497 0 0 1 1.901715-17.885019l41.850434-33.81108a12.720497 12.720497 0 0 1 17.885019 1.901714l10.49441 12.987627a12.720497 12.720497 0 0 1-1.908075 17.885019z" fill="#F8E71C" p-id="5082"></path><path d="M712.303304 265.298683m-36.278857 0a36.278857 36.278857 0 1 0 72.557714 0 36.278857 36.278857 0 1 0-72.557714 0Z" fill="#FE3D50" p-id="5083"></path><path d="M712.303304 258.938435m-36.278857 0a36.278857 36.278857 0 1 0 72.557714 0 36.278857 36.278857 0 1 0-72.557714 0Z" fill="#FE3D50" p-id="5084"></path><path d="M513.068522 519.988472m-19.017143 0a19.017143 19.017143 0 1 0 38.034286 0 19.017143 19.017143 0 1 0-38.034286 0Z" fill="#51E4C2" p-id="5085"></path><path d="M513.068522 513.628224m-19.017143 0a19.017143 19.017143 0 1 0 38.034286 0 19.017143 19.017143 0 1 0-38.034286 0Z" fill="#FFFFFF" p-id="5086"></path></svg>
    </button>
    <div v-show="panelVisible" class="music-panel">
      <!-- 当前播放信息 -->
      <div class="current-track">
        <div class="track-name">{{ currentTrack.name }}</div>
        <audio ref="audio" :src="currentTrack.url" @ended="nextTrack" controls></audio>
        <div class="controls">
          <button @click="prevTrack" :disabled="!hasPrev">⏮</button>
          <button @click="togglePlay">{{ isPlaying ? '⏸' : '▶' }}</button>
          <button @click="nextTrack" :disabled="!hasNext">⏭</button>
        </div>
      </div>

      <!-- 歌曲列表 -->
      <div class="playlist">
        <div class="playlist-title">播放列表</div>
        <ul>
          <li v-for="(track, idx) in playlist" :key="idx" @click="selectTrack(idx)" :class="{ active: idx === currentIndex }">
            {{ track.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 替换为你的在线音乐链接
const playlist = ref([
  { name: '夏日午后', url: 'https://iwangc.oss-cn-shanghai.aliyuncs.com/%E7%A8%BB%E9%A6%99-%E5%91%A8%E6%9D%B0%E4%BC%A6.mp3' },
  { name: '夜曲', url: 'https://iwangc.oss-cn-shanghai.aliyuncs.com/Thomas Greenberg - The Human Touch_H.ogg' },
  { name: '轻风', url: '' },
])

const currentIndex = ref(0)
const audio = ref(null)
const isPlaying = ref(false)
const panelVisible = ref(false)

const currentTrack = computed(() => playlist.value[currentIndex.value])
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < playlist.value.length - 1)

const togglePlay = () => {
  if (audio.value.paused) {
    audio.value.play()
    isPlaying.value = true
  } else {
    audio.value.pause()
    isPlaying.value = false
  }
}

const selectTrack = (idx) => {
  if (idx === currentIndex.value) return
  currentIndex.value = idx
  audio.value.src = currentTrack.value.url
  audio.value.play()
  isPlaying.value = true
}

const nextTrack = () => {
  if (hasNext.value) {
    currentIndex.value++
    audio.value.src = currentTrack.value.url
    audio.value.play()
    isPlaying.value = true
  }
}

const prevTrack = () => {
  if (hasPrev.value) {
    currentIndex.value--
    audio.value.src = currentTrack.value.url
    audio.value.play()
    isPlaying.value = true
  }
}

const togglePanel = () => {
  panelVisible.value = !panelVisible.value
}

const onEnded = () => {
  if (hasNext.value) {
    nextTrack()
  } else {
    isPlaying.value = false
  }
}

// 点击面板外部关闭
const handleClickOutside = (e) => {
  if (!e.target.closest('.nav-music-player')) {
    panelVisible.value = false
  }
}

onMounted(() => {
  audio.value.addEventListener('ended', onEnded)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  audio.value.removeEventListener('ended', onEnded)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-music-player {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
}
.music-panel audio {
  width: 100% !important;
  height: 40px; /* 可选，降低高度 */
}

.music-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.music-icon:hover,
.music-icon.active {
  color: var(--vp-c-brand-1);
}
.music-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px;
  width: 280px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 100;
}
.current-track {
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.track-name {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
}
.controls button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}
.controls button:hover:not(:disabled) {
  color: var(--vp-c-brand-1);
}
.controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.playlist-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-bottom: 6px;
}
.playlist ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}
.playlist li {
  padding: 6px 8px;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlist li:hover {
  background: var(--vp-c-bg-soft);
}
.playlist li.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 500;
}
</style>