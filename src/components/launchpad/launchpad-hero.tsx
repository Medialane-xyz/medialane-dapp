"use client"

export function LaunchpadHero() {
    return (
        <section className="mb-8 pt-2">
            <h1 className="lp-greeting text-foreground">
                What will you{" "}
                <span className="lp-greeting-accent">create</span>
                <span className="lp-cursor" aria-hidden="true" />
            </h1>
            <p className="mt-2 text-sm text-muted-foreground/70 max-w-md leading-relaxed">
                Pick a tool. Launch something new. Zero fees, full ownership.
            </p>
        </section>
    )
}
