export class CancellationToken {
    private cancelled = false;

    public cancel() {
        this.cancelled = true;
    }

    public isCancelled(): boolean {
        return this.cancelled;
    }
}
