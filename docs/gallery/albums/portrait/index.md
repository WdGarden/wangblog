---
title: 人像
---

# 人像

记录光影中的人物瞬间，捕捉真实的情感。

<div class="image-grid">
 <img src="https://iwangc.oss-cn-shanghai.aliyuncs.com/202432113918016.jpg" alt="沉思" />
  <img src="https://iwangc.oss-cn-shanghai.aliyuncs.com/newsbg.jpg" alt="微笑" />
  <img src="https://iwangc.oss-cn-shanghai.aliyuncs.com/20243291333394290.jpg" alt="凝望" />
</div>

<style>
.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}
.image-grid img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.image-grid img:hover {
  transform: scale(1.02);
}
@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .image-grid {
    grid-template-columns: 1fr;
  }
}
</style>