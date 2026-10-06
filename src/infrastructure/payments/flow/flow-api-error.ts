/** Error devuelto por la API REST de Flow (JSON con `code` y `message`). */
export class FlowApiError extends Error {
  readonly httpStatus: number;
  readonly flowCode: number | null;

  constructor(
    message: string,
    opts: { httpStatus: number; flowCode?: number | null }
  ) {
    super(message);
    this.name = "FlowApiError";
    this.httpStatus = opts.httpStatus;
    this.flowCode = opts.flowCode ?? null;
  }
}
