import { animationFrameScheduler, defer, interval, Observable } from "rxjs";
import { map, takeWhile, tap } from "rxjs/operators"
import { elasticOut } from "eases";


const balls = Array.from(document.querySelectorAll('.ball')) as HTMLElement[];

const msElapsed = (schedule = animationFrameScheduler) => {
  return defer(() => {
    const start = schedule.now();

    return interval(0, schedule).pipe(map(() => {
      return schedule.now() - start;
    }));
  });
}

const pixelsPerSecond = (v: number) => (ms: number) => v * ms / 1000;
const duration = (ms: number) =>
  msElapsed().pipe(
    map(ems => ems / ms),
    takeWhile(t => t < 1),
  );

const distance = (d: number) => (t: number) => t * d;

// duration(2000).pipe(
//   map(elasticOut),
//   map(distance(300))
// ).subscribe((frame) => {
//   ball.style.transform = `translate3d(0, ${frame}px, 0)`;
// })

const moveBall = (duration$: Observable<number>, ball: HTMLElement) => duration$.pipe(
  map(elasticOut),
  map(distance(300)),
  tap((frame) => ball.style.transform = `translate3d(0, ${frame}px, 0)`),
)

balls.forEach((ball, index) => {
  moveBall(duration((2 + index) * 1000), ball).subscribe();
})


// msElapsed().pipe(
//   takeWhile(number => number <= 2000),
//   tap(() => {
//     console.log('This is for log', '..2.3....');
//   }),
//   map(pixelsPerSecond(50))
// ).subscribe((frame) => {
//   ball.style.transform = `translate3d(0, ${frame}px, 0)`;
// })

