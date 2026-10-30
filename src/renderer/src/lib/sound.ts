/**
 * Synthesizes a soft, pleasant completion chime using Web Audio API.
 * 100% self-contained with zero external audio assets or network requests.
 */
export function playCompletionSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const now = ctx.currentTime

    // Two-tone bell harmonic frequencies (F#5 -> B5)
    const notes = [739.99, 987.77]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      // Soft envelope (gentle attack, exponential decay)
      gain.gain.setValueAtTime(0, now + idx * 0.08)
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.4)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.45)
    })
  } catch {
    // Ignore if audio context is blocked by browser policy
  }
}
