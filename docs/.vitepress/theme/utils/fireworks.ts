// docs/.vitepress/theme/fireworks.ts
// 鼠标点击烟花效果 - 低调版 (小星星版本)
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

    // 粒子数组（现在是星星）
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;       // 星星的外接圆半径
      rotation: number;   // 星星的旋转角度
      life: number;
    }> = [];

    // 监听窗口大小变化，调整画布尺寸
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // 点击事件：生成星星粒子
    document.addEventListener('click', (e) => {
      const count = 15;                     // 粒子数量
      const colors = ['#ff0040', '#ffb300', '#00ff80', '#00b0ff', '#b400ff'];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 6,     // 水平速度范围
          vy: (Math.random() - 0.5) * 6 - 3, // 垂直速度（略微向上）
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,       // 星星大小（外接圆半径 2~6）
          rotation: Math.random() * Math.PI * 2, // 随机旋转角度
          life: 1.0
        });
      }
    }, true);

    // 绘制五角星的函数
    function drawStar(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      outerR: number,    // 外接圆半径
      color: string,
      rotation: number,
      life: number
    ) {
      if (outerR < 0.5) return; // 太小就不画了

      const innerR = outerR * 0.4; // 内半径（调整比例可改变星形胖瘦）
      const points = 5;             // 五角星

      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerR : innerR; // 交替外/内半径
        const angle = rotation + (i * Math.PI) / points; // 每个点间隔36度
        const dx = x + radius * Math.cos(angle);
        const dy = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(dx, dy);
        } else {
          ctx.lineTo(dx, dy);
        }
      }
      ctx.closePath();

      ctx.globalAlpha = life;
      ctx.fillStyle = color;
      ctx.fill();
    }

    // 动画循环
    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // 物理更新
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;        // 重力，让星星下落
        p.life -= 0.015;      // 生命衰减速度
        p.size *= 0.98;       // 尺寸逐渐缩小

        // 绘制星星
        drawStar(ctx, p.x, p.y, p.size, p.color, p.rotation, p.life);

        // 移除死亡的星星
        if (p.life <= 0 || p.size < 0.8) {
          particles.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animate);
    }

    animate();
}