// docs/.vitepress/theme/fireworks.ts
// 鼠标点击烟花效果 - 低调版
export function setupFireworks() {
    if (typeof window === 'undefined') return;

    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // 让点击穿透到页面
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // 粒子数组
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
    }> = [];

    // 监听窗口大小变化，调整画布尺寸
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // 点击事件：生成粒子
    document.addEventListener('click', (e) => {
      // 低调参数：粒子数量少，速度慢，尺寸小
      const count = 15;                     // 粒子数量
      const colors = ['#ff0040', '#ffb300', '#00ff80', '#00b0ff', '#b400ff'];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 6,     // 水平速度范围
          vy: (Math.random() - 0.5) * 6 - 3, // 垂直速度（略微向上）
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 1,       // 粒子大小 1~5
          life: 1.0                           // 初始生命值
        });
      }
    });

    // 动画循环
    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 物理更新
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;        // 重力，让粒子下落
        p.life -= 0.015;      // 生命衰减速度
        p.size *= 0.98;       // 尺寸逐渐缩小

        // 绘制粒子
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // 移除死亡的粒子
        if (p.life <= 0 || p.size < 0.5) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);
    }

    animate();
  }