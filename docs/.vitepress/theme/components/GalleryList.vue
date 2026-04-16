<template>
  <div class="gallery-list">
    <div v-for="album in albums" :key="album.link" class="gallery-card">
      <a :href="album.link" class="card-link">
        <div class="card-image">
          <img :src="album.cover" :alt="album.title" >
          <!-- 右上角图片数量徽章 -->
          <span class="photo-count-badge">{{ album.photoCount }}张</span>
          <!-- 底部标题（始终显示） -->
          <div class="image-title">{{ album.title }}</div>
          <!-- 描述文字（悬停时显示） -->
          <div class="image-description">{{ album.description }}</div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'



const albums = ref([
  {
    title: '人像',
    description: '记录光影中的人物瞬间',
    link: '/gallery/albums/portrait/',
    cover: 'https://iwangc.oss-cn-shanghai.aliyuncs.com/20244714905789.jpg',
    photoCount: 12
  },
  {
    title: '动物',
    description: '捕捉自然界的灵动与可爱',
    link: '/gallery/albums/animal/',
    cover: 'https://iwangc.oss-cn-shanghai.aliyuncs.com/【哲风壁纸】云-低角度-动漫女孩.png',
    photoCount: 8
  },
  {
    title: '风景',
    description: '行摄世界，定格壮丽山河',
    link: '/gallery/albums/landscape/',
    cover: 'https://iwangc.oss-cn-shanghai.aliyuncs.com/【哲风壁纸】千束-莉可丽丝.png',
    photoCount: 15
  }
])
</script>

<style scoped>
.gallery-list {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 2rem;
  margin: 3rem 0;
}

@media (max-width: 1200px) {
  .gallery-list { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .gallery-list { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .gallery-list { grid-template-columns: 1fr; }
}

.card-link {
  text-decoration: none;
  display: block;
}

.card-image {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #000;
  height: 320px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card-image:hover img {
  transform: scale(1.05);
}

/* 右上角图片数量徽章 */
.photo-count-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 2;
  pointer-events: none;
}

/* 底部标题（始终显示） */
.image-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem 1rem 0.5rem;
  transition: transform 0.3s ease;
  transform: translateY(0);
}

/* 描述文字（默认隐藏，悬停时从底部滑入） */
.image-description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-size: 0.85rem;
  padding: 0.8rem 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

/* 悬停时：标题向上移动，描述滑入 */
.card-image:hover .image-title {
  transform: translateY(-60px);  /* 上移，留出空间给描述 */
}

.card-image:hover .image-description {
  transform: translateY(0);
}
</style>