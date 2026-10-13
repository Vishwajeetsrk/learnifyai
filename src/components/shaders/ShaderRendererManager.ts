/**
 * Unified Shader Renderer Manager
 * Enforces explicit lifecycle state machine, cancellation tokens (generationId),
 * WebGL hardware context garbage collection (WEBGL_lose_context), and single active RAF loop.
 */

export type ShaderRendererState = "idle" | "loading" | "compiling" | "ready" | "switching" | "error";

export interface ShaderLifecycleEvent {
  variantId: string;
  state: ShaderRendererState;
  generationId: number;
  error?: string | null;
  timestamp: number;
}

type StateListener = (event: ShaderLifecycleEvent) => void;

class ShaderRendererManagerClass {
  private currentState: ShaderRendererState = "idle";
  private currentVariantId: string = "raking-light-pill";
  private currentGenerationId: number = 0;
  private currentError: string | null = null;
  private listeners: Set<StateListener> = new Set();

  // Active resource tracking
  private activeRafId: number | null = null;
  private activeCanvases: Set<HTMLCanvasElement> = new Set();
  private activeGlContexts: Set<WebGLRenderingContext | WebGL2RenderingContext> = new Set();
  private activeIframes: Set<HTMLIFrameElement> = new Set();

  /**
   * Subscribe to state updates
   */
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current state snapshot
   */
  public getSnapshot(): ShaderLifecycleEvent {
    return {
      variantId: this.currentVariantId,
      state: this.currentState,
      generationId: this.currentGenerationId,
      error: this.currentError,
      timestamp: Date.now(),
    };
  }

  public getState(): ShaderRendererState {
    return this.currentState;
  }

  public getGenerationId(): number {
    return this.currentGenerationId;
  }

  public getCurrentVariantId(): string {
    return this.currentVariantId;
  }

  /**
   * Request variant switch: advances generation token, cancels in-flight work, and disposes old WebGL resources
   */
  public startSwitch(nextVariantId: string): number {
    this.currentGenerationId += 1;
    const generation = this.currentGenerationId;

    this.cancelActiveRaf();
    this.disposeTrackedResources();

    this.currentVariantId = nextVariantId;
    this.currentState = "switching";
    this.currentError = null;

    this.notify();
    return generation;
  }

  /**
   * Set state to compiling
   */
  public markCompiling(generationId: number): boolean {
    if (generationId !== this.currentGenerationId) return false;
    this.currentState = "compiling";
    this.notify();
    return true;
  }

  /**
   * Set state to ready
   */
  public markReady(generationId: number): boolean {
    if (generationId !== this.currentGenerationId) return false;
    this.currentState = "ready";
    this.currentError = null;
    this.notify();
    return true;
  }

  /**
   * Report error with generation check
   */
  public reportError(errorMsg: string, generationId?: number): void {
    if (generationId !== undefined && generationId !== this.currentGenerationId) return;
    this.currentState = "error";
    this.currentError = errorMsg;
    this.notify();
  }

  /**
   * Register a canvas for tracking and automatic disposal
   */
  public registerCanvas(canvas: HTMLCanvasElement): void {
    this.activeCanvases.add(canvas);
  }

  /**
   * Register a WebGL context for explicit loseContext disposal
   */
  public registerGl(gl: WebGLRenderingContext | WebGL2RenderingContext): void {
    this.activeGlContexts.add(gl);
  }

  /**
   * Register an iframe for src="about:blank" disposal
   */
  public registerIframe(frame: HTMLIFrameElement): void {
    this.activeIframes.add(frame);
  }

  /**
   * Register and manage the single active RAF animation loop
   */
  public setRaf(rafId: number): void {
    this.cancelActiveRaf();
    this.activeRafId = rafId;
  }

  /**
   * Cancel active RAF loop
   */
  public cancelActiveRaf(): void {
    if (this.activeRafId !== null) {
      cancelAnimationFrame(this.activeRafId);
      this.activeRafId = null;
    }
  }

  /**
   * Force WebGL garbage collection across all active contexts and iframes
   */
  public disposeTrackedResources(): void {
    // 1. Explicitly lose WebGL context to free GPU slots in Chromium
    for (const gl of this.activeGlContexts) {
      try {
        const lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
      } catch {
        // noop
      }
    }
    this.activeGlContexts.clear();

    // 2. Clear canvases
    for (const canvas of this.activeCanvases) {
      try {
        canvas.width = 1;
        canvas.height = 1;
      } catch {
        // noop
      }
    }
    this.activeCanvases.clear();

    // 3. Clear iframes
    for (const iframe of this.activeIframes) {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ threeuiDispose: true }, "*");
        }
        iframe.src = "about:blank";
      } catch {
        // noop
      }
    }
    this.activeIframes.clear();
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error("[ShaderRendererManager] Listener error:", err);
      }
    });
  }
}

export const shaderRendererManager = new ShaderRendererManagerClass();
