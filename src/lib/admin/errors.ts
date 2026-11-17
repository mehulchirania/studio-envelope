// Dependency-free so any server module can import it without creating an import cycle.
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}
