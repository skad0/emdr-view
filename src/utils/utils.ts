export function format(first: string, middle: string, last: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

export interface Interval {
  run(skipCall?: boolean): void
  stop(): void
}

export function Interval(fn, duration, ...args): Interval {
  let baseline = undefined
  let timer

  const run = (skipCall: boolean = false) => {
    if (baseline === undefined) {
      baseline = new Date().getTime() - duration
    }
    if (!skipCall) {
      fn(...args);
    }
    const end = new Date().getTime();
    baseline += duration

    let nextTick = duration - (end - baseline);
    if (nextTick < 0) {
      nextTick = 0
    }

    console.log(nextTick);
    timer = setTimeout(function(){
      run(false)
    }, nextTick)
  }

  const stop = () => {
    clearTimeout(timer)
  }

  return {
    run,
    stop
  }
}
