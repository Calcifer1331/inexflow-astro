function handleClick(e) {
    if (!document.startViewTransition) {
        updateTheDOMSomehow();
        return;
    }

    document.startViewTransition(() => updateTheDOMSomehow());
}