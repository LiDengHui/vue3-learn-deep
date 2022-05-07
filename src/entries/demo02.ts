const bucket: WeakMap<
    Record<PropertyKey, unknown>,
    Map<PropertyKey, Set<() => void>>
> = new WeakMap();

interface ActiveEffect {
    (): void;
    deps: Array<Set<() => void>>;
}

let activeEffect: ActiveEffect;
const effectStack: ActiveEffect[] = [];
function effect(fn: () => void) {
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(effectFn);
        fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
    };
    effectFn.deps = [] as Array<Set<() => void>>;
    effectFn();
}

function cleanup(effectFn: ActiveEffect) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];

        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}

function track(target: Record<PropertyKey, unknown>, key: PropertyKey) {
    if (!activeEffect) return;
    let depsMap: Map<PropertyKey, Set<() => void>> | undefined =
        bucket.get(target);

    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()));
    }

    let deps: Set<() => void> | undefined = depsMap.get(key);

    if (!deps) {
        depsMap.set(key, (deps = new Set()));
    }

    deps.add(activeEffect);

    activeEffect.deps.push(deps);
}

function trigger(target: Record<PropertyKey, unknown>, key: PropertyKey) {
    const depsMap = bucket.get(target);
    if (!depsMap) {
        return;
    }
    const effects = depsMap.get(key);
    const effectsToRun = new Set<() => void>();

    effects &&
        effects.forEach((effectFn) => {
            if (effectFn !== activeEffect) {
                effectsToRun.add(effectFn);
            }
        });
    effectsToRun.forEach((effectFn) => effectFn());
    return;
}

const data = {
    foo: 1,
};

const obj = new Proxy(data, {
    get(target, key: keyof typeof data) {
        track(target, key);
        return target[key];
    },
    set(target, key: keyof typeof data, newValue) {
        target[key] = newValue;
        trigger(target, key);
        return true;
    },
});

effect(() => {
    console.log('effectFn1 执行');

    obj.foo = obj.foo + 1;
});
