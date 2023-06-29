export class AsyncQueue {
  private concurrency: number;
  private tasks: (() => Promise<void>)[];
  private running: number;

  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.tasks = [];
    this.running = 0;
  }

  push(task: () => Promise<void>) {
    this.tasks.push(task);
    this.run();
  }

  private async run() {
    if (this.running >= this.concurrency || this.tasks.length === 0) {
      return;
    }

    const task = this.tasks.shift() as () => Promise<void>;

    this.running++;

    try {
      await task();
    } catch (e) {
      throw e;
    } finally {
      this.running--;
      this.run();
    }
  }
}
