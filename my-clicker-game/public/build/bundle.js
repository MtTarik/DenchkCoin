
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Components/Container.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/Components/Container.svelte";

    // (8:2) {#if show_title}
    function create_if_block$3(ctx) {
    	let h1;
    	let t;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h1, "class", "svelte-julr55");
    			add_location(h1, file$6, 8, 4, 149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(8:2) {#if show_title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t;
    	let div_style_value;
    	let current;
    	let if_block = /*show_title*/ ctx[2] && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "style", div_style_value = `flex-grow: ${/*grow*/ ctx[1]}`);
    			attr_dev(div, "class", "svelte-julr55");
    			add_location(div, file$6, 6, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*show_title*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*grow*/ 2 && div_style_value !== (div_style_value = `flex-grow: ${/*grow*/ ctx[1]}`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { title } = $$props;
    	let { grow } = $$props;
    	let { show_title = true } = $$props;
    	const writable_props = ['title', 'grow', 'show_title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('grow' in $$props) $$invalidate(1, grow = $$props.grow);
    		if ('show_title' in $$props) $$invalidate(2, show_title = $$props.show_title);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, grow, show_title });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('grow' in $$props) $$invalidate(1, grow = $$props.grow);
    		if ('show_title' in $$props) $$invalidate(2, show_title = $$props.show_title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, grow, show_title, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { title: 0, grow: 1, show_title: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Container> was created without expected prop 'title'");
    		}

    		if (/*grow*/ ctx[1] === undefined && !('grow' in props)) {
    			console.warn("<Container> was created without expected prop 'grow'");
    		}
    	}

    	get title() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get grow() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grow(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get show_title() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show_title(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let score = writable(0.0);
    let highscore = writable(0.0);
    /* UPGRADES */

    let cost_multiplier = writable(1.1);

    let multipliers = writable({
      Clicker: 1.06,
      Robot01: 1.11,
      Robot02: 1.13,
      Cookie: 1.4,
      GPU: 1.09,
    });

    let costs = writable({
      Clicker: 0.0002,
      Robot01: 0.035,
      Robot02: 0.115,
      Cookie: 0.0005,
      GPU: 0.0155,
    });

    let upgrade_costs = writable({
      Cookie: 0.00025,
      Robot01: 0.015,
      Robot02: 0.045,
      Clicker: 0.0015,
      GPU: 0.0075,
    });

    let increments = writable({
      Cookie: 0.00001,
      Clicker: 0.00002,
      Robot01: 0.00025,
      Robot02: 0.002,
      GPU: 0.00012,
    });

    // info
    let info_map = writable([
      {
        Stage: "Planet",
        "C02 Emissions": "543 lbs/sec",
        Atmosphere: "Normal",
        "Flora/Fauna": "Normal",
        Civilization: "Functional",
      },
    ]);

    /* src/Components/Cookie.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/Components/Cookie.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img = element("img");
    			attr_dev(img, "class", "ominous-hover svelte-efnbxc");
    			attr_dev(img, "alt", "btc");
    			if (!src_url_equal(img.src, img_src_value = /*img_path*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "draggable", "false");
    			add_location(img, file$5, 40, 2, 663);
    			attr_dev(button, "class", "svelte-efnbxc");
    			add_location(button, file$5, 33, 0, 560);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $increments;
    	let $multipliers;
    	let $costs;
    	let $score;
    	let $highscore;
    	validate_store(increments, 'increments');
    	component_subscribe($$self, increments, $$value => $$invalidate(7, $increments = $$value));
    	validate_store(multipliers, 'multipliers');
    	component_subscribe($$self, multipliers, $$value => $$invalidate(9, $multipliers = $$value));
    	validate_store(costs, 'costs');
    	component_subscribe($$self, costs, $$value => $$invalidate(10, $costs = $$value));
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(1, $score = $$value));
    	validate_store(highscore, 'highscore');
    	component_subscribe($$self, highscore, $$value => $$invalidate(2, $highscore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Cookie', slots, []);
    	const name = "Cookie";
    	let increment = 0.00001;
    	let img_path = "/assets/btc_01.png";

    	const buyUpgrade = () => {
    		if ($score < $costs[name]) {
    			return;
    		}

    		set_store_value(score, $score -= $costs[name], $score);
    		set_store_value(increments, $increments[name] *= $multipliers[name], $increments);
    	};

    	const a = new Audio("/sounds/click_001.mp3");

    	let play = () => {
    		if (!a.paused) {
    			a.play();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Cookie> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(score, $score += increment, $score);
    		set_store_value(highscore, $highscore += increment, $highscore);
    		play();
    	};

    	$$self.$capture_state = () => ({
    		score,
    		increments,
    		costs,
    		multipliers,
    		highscore,
    		name,
    		increment,
    		img_path,
    		buyUpgrade,
    		a,
    		play,
    		$increments,
    		$multipliers,
    		$costs,
    		$score,
    		$highscore
    	});

    	$$self.$inject_state = $$props => {
    		if ('increment' in $$props) $$invalidate(0, increment = $$props.increment);
    		if ('img_path' in $$props) $$invalidate(3, img_path = $$props.img_path);
    		if ('play' in $$props) $$invalidate(4, play = $$props.play);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$increments*/ 128) {
    			$$invalidate(0, increment = $increments[name]);
    		}
    	};

    	return [
    		increment,
    		$score,
    		$highscore,
    		img_path,
    		play,
    		name,
    		buyUpgrade,
    		$increments,
    		click_handler
    	];
    }

    class Cookie extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 5, buyUpgrade: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cookie",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get name() {
    		return this.$$.ctx[5];
    	}

    	set name(value) {
    		throw new Error("<Cookie>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buyUpgrade() {
    		return this.$$.ctx[6];
    	}

    	set buyUpgrade(value) {
    		throw new Error("<Cookie>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Clicker.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/Components/Clicker.svelte";

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_style(div, "background-color", "red");
    			add_location(div, file$4, 32, 0, 532);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let increment;
    	let $increments;
    	let $highscore;
    	let $score;
    	validate_store(increments, 'increments');
    	component_subscribe($$self, increments, $$value => $$invalidate(2, $increments = $$value));
    	validate_store(highscore, 'highscore');
    	component_subscribe($$self, highscore, $$value => $$invalidate(5, $highscore = $$value));
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(6, $score = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Clicker', slots, []);
    	let { speed = 1 } = $$props;
    	const name = "Clicker";
    	let clicker; // to bind
    	let mounted = false;

    	const action = () => {
    		set_store_value(score, $score += increment, $score);

    		if (increment > 0) {
    			set_store_value(highscore, $highscore += increment, $highscore);
    		}

    		setTimeout(action, 1000 / speed);
    	};

    	onMount(() => {
    		action();
    		mounted = true;
    	});

    	const writable_props = ['speed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Clicker> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		score,
    		increments,
    		costs,
    		multipliers,
    		highscore,
    		speed,
    		name,
    		clicker,
    		mounted,
    		action,
    		increment,
    		$increments,
    		$highscore,
    		$score
    	});

    	$$self.$inject_state = $$props => {
    		if ('speed' in $$props) $$invalidate(0, speed = $$props.speed);
    		if ('clicker' in $$props) clicker = $$props.clicker;
    		if ('mounted' in $$props) mounted = $$props.mounted;
    		if ('increment' in $$props) increment = $$props.increment;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$increments*/ 4) {
    			increment = $increments[name];
    		}
    	};

    	return [speed, name, $increments];
    }

    class Clicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { speed: 0, name: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Clicker",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get speed() {
    		throw new Error("<Clicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speed(value) {
    		throw new Error("<Clicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		return this.$$.ctx[1];
    	}

    	set name(value) {
    		throw new Error("<Clicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/Components/ClickerJuicer.svelte generated by Svelte v3.46.4 */
    const file$3 = "src/Components/ClickerJuicer.svelte";

    // (59:12) {#if total > 0}
    function create_if_block$2(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1_value = /*total*/ ctx[8].toFixed(5) + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text("total: ");
    			t1 = text(t1_value);
    			add_location(h3, file$3, 60, 16, 1586);
    			attr_dev(div, "class", "total svelte-1e8xhwh");
    			add_location(div, file$3, 59, 12, 1550);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*total*/ 256 && t1_value !== (t1_value = /*total*/ ctx[8].toFixed(5) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(59:12) {#if total > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let button;
    	let div5;
    	let div0;
    	let h30;
    	let t0;
    	let t1;
    	let img_1;
    	let img_1_src_value;
    	let t2;
    	let div1;
    	let p0;
    	let t3;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let div4;
    	let div2;
    	let h31;
    	let t7;
    	let t8_value = /*cost*/ ctx[5].toFixed(5) + "";
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let h32;
    	let t11;
    	let t12_value = /*increment*/ ctx[6].toFixed(5) + "";
    	let t12;
    	let t13;
    	let t14;
    	let div5_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*total*/ ctx[8] > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			div5 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			t0 = text(/*len*/ ctx[4]);
    			t1 = space();
    			img_1 = element("img");
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t3 = text(/*display_name*/ ctx[1]);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*description*/ ctx[2]);
    			t6 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h31 = element("h3");
    			t7 = text("-");
    			t8 = text(t8_value);
    			t9 = text("₿");
    			t10 = space();
    			div3 = element("div");
    			h32 = element("h3");
    			t11 = text("+");
    			t12 = text(t12_value);
    			t13 = text("₿/s");
    			t14 = space();
    			if (if_block) if_block.c();
    			add_location(h30, file$3, 38, 12, 905);
    			attr_dev(div0, "class", "len svelte-1e8xhwh");
    			add_location(div0, file$3, 37, 8, 875);
    			attr_dev(img_1, "class", "gif svelte-1e8xhwh");
    			attr_dev(img_1, "alt", /*name*/ ctx[0]);
    			if (!src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[3])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "draggable", "false");
    			toggle_class(img_1, "scaleUp", /*name*/ ctx[0] == 'Robot02');
    			toggle_class(img_1, "scaleUp2", /*name*/ ctx[0] == 'GPU');
    			add_location(img_1, file$3, 40, 8, 943);
    			attr_dev(p0, "class", "name svelte-1e8xhwh");
    			add_location(p0, file$3, 44, 12, 1122);
    			attr_dev(p1, "class", "description svelte-1e8xhwh");
    			add_location(p1, file$3, 47, 12, 1199);
    			attr_dev(div1, "class", "text svelte-1e8xhwh");
    			add_location(div1, file$3, 43, 8, 1091);
    			add_location(h31, file$3, 53, 16, 1358);
    			attr_dev(div2, "class", "cost svelte-1e8xhwh");
    			add_location(div2, file$3, 52, 12, 1323);
    			add_location(h32, file$3, 56, 16, 1455);
    			attr_dev(div3, "class", "income svelte-1e8xhwh");
    			add_location(div3, file$3, 55, 12, 1418);
    			attr_dev(div4, "class", "btc svelte-1e8xhwh");
    			add_location(div4, file$3, 51, 8, 1293);
    			attr_dev(div5, "class", "container svelte-1e8xhwh");
    			add_location(div5, file$3, 36, 4, 825);
    			attr_dev(button, "class", "svelte-1e8xhwh");
    			toggle_class(button, "cant_afford", !/*can_afford*/ ctx[7]);
    			add_location(button, file$3, 35, 0, 765);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div5);
    			append_dev(div5, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t0);
    			append_dev(div5, t1);
    			append_dev(div5, img_1);
    			append_dev(div5, t2);
    			append_dev(div5, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h31);
    			append_dev(h31, t7);
    			append_dev(h31, t8);
    			append_dev(h31, t9);
    			append_dev(div4, t10);
    			append_dev(div4, div3);
    			append_dev(div3, h32);
    			append_dev(h32, t11);
    			append_dev(h32, t12);
    			append_dev(h32, t13);
    			append_dev(div4, t14);
    			if (if_block) if_block.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*buy*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*len*/ 16) set_data_dev(t0, /*len*/ ctx[4]);

    			if (!current || dirty & /*name*/ 1) {
    				attr_dev(img_1, "alt", /*name*/ ctx[0]);
    			}

    			if (!current || dirty & /*img*/ 8 && !src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[3])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				toggle_class(img_1, "scaleUp", /*name*/ ctx[0] == 'Robot02');
    			}

    			if (dirty & /*name*/ 1) {
    				toggle_class(img_1, "scaleUp2", /*name*/ ctx[0] == 'GPU');
    			}

    			if (!current || dirty & /*display_name*/ 2) set_data_dev(t3, /*display_name*/ ctx[1]);
    			if (!current || dirty & /*description*/ 4) set_data_dev(t5, /*description*/ ctx[2]);
    			if ((!current || dirty & /*cost*/ 32) && t8_value !== (t8_value = /*cost*/ ctx[5].toFixed(5) + "")) set_data_dev(t8, t8_value);
    			if ((!current || dirty & /*increment*/ 64) && t12_value !== (t12_value = /*increment*/ ctx[6].toFixed(5) + "")) set_data_dev(t12, t12_value);

    			if (/*total*/ ctx[8] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div4, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*can_afford*/ 128) {
    				toggle_class(button, "cant_afford", !/*can_afford*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, slide, {}, true);
    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div5_transition) div5_transition = create_bidirectional_transition(div5, slide, {}, false);
    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (detaching && div5_transition) div5_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let total;
    	let $score;
    	let $increments;
    	let $costs;
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(10, $score = $$value));
    	validate_store(increments, 'increments');
    	component_subscribe($$self, increments, $$value => $$invalidate(11, $increments = $$value));
    	validate_store(costs, 'costs');
    	component_subscribe($$self, costs, $$value => $$invalidate(12, $costs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClickerJuicer', slots, []);
    	const dispatch = createEventDispatcher();
    	let { name = 'Name' } = $$props;
    	let { display_name } = $$props;
    	let { description = 'Lorem ipsum dolor sit amet...' } = $$props;
    	let { img = '/assets/robot_1.gif' } = $$props;
    	let { len = 0 } = $$props;
    	let cost = 0.0;
    	let increment = 0.0;
    	let me;
    	let can_afford = false;

    	const buy = () => {
    		dispatch('buy', { name, 'amount': 1 });
    	};

    	const writable_props = ['name', 'display_name', 'description', 'img', 'len'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClickerJuicer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('display_name' in $$props) $$invalidate(1, display_name = $$props.display_name);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('img' in $$props) $$invalidate(3, img = $$props.img);
    		if ('len' in $$props) $$invalidate(4, len = $$props.len);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		score,
    		costs,
    		increments,
    		dispatch,
    		slide,
    		name,
    		display_name,
    		description,
    		img,
    		len,
    		cost,
    		increment,
    		me,
    		can_afford,
    		buy,
    		total,
    		$score,
    		$increments,
    		$costs
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('display_name' in $$props) $$invalidate(1, display_name = $$props.display_name);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('img' in $$props) $$invalidate(3, img = $$props.img);
    		if ('len' in $$props) $$invalidate(4, len = $$props.len);
    		if ('cost' in $$props) $$invalidate(5, cost = $$props.cost);
    		if ('increment' in $$props) $$invalidate(6, increment = $$props.increment);
    		if ('me' in $$props) me = $$props.me;
    		if ('can_afford' in $$props) $$invalidate(7, can_afford = $$props.can_afford);
    		if ('total' in $$props) $$invalidate(8, total = $$props.total);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$costs, name*/ 4097) {
    			$$invalidate(5, cost = $costs[name]);
    		}

    		if ($$self.$$.dirty & /*$increments, name*/ 2049) {
    			$$invalidate(6, increment = $increments[name]);
    		}

    		if ($$self.$$.dirty & /*cost, $score*/ 1056) {
    			$$invalidate(7, can_afford = cost <= $score);
    		}

    		if ($$self.$$.dirty & /*increment, len*/ 80) {
    			$$invalidate(8, total = increment * len);
    		}
    	};

    	return [
    		name,
    		display_name,
    		description,
    		img,
    		len,
    		cost,
    		increment,
    		can_afford,
    		total,
    		buy,
    		$score,
    		$increments,
    		$costs
    	];
    }

    class ClickerJuicer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			name: 0,
    			display_name: 1,
    			description: 2,
    			img: 3,
    			len: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClickerJuicer",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*display_name*/ ctx[1] === undefined && !('display_name' in props)) {
    			console.warn("<ClickerJuicer> was created without expected prop 'display_name'");
    		}
    	}

    	get name() {
    		throw new Error("<ClickerJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ClickerJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get display_name() {
    		throw new Error("<ClickerJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set display_name(value) {
    		throw new Error("<ClickerJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<ClickerJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<ClickerJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<ClickerJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<ClickerJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get len() {
    		throw new Error("<ClickerJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set len(value) {
    		throw new Error("<ClickerJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Upgrade.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/Components/Upgrade.svelte";

    // (25:0) {#if !not_defined}
    function create_if_block$1(ctx) {
    	let button;
    	let img_1;
    	let img_1_src_value;
    	let t0;
    	let h3;
    	let t1_value = /*target_cost*/ ctx[4].toFixed(5) + "";
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			img_1 = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			if (!src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[1])) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "upgrade");
    			attr_dev(img_1, "class", "svelte-ob1zw6");
    			toggle_class(img_1, "scaleUp", /*name*/ ctx[0] == 'Robot02');
    			add_location(img_1, file$2, 26, 4, 689);
    			attr_dev(h3, "class", "cost svelte-ob1zw6");
    			add_location(h3, file$2, 27, 4, 756);
    			attr_dev(button, "class", "svelte-ob1zw6");
    			toggle_class(button, "tooExpensive", /*too_expensive*/ ctx[2]);
    			toggle_class(button, "not_defined", /*not_defined*/ ctx[3]);
    			add_location(button, file$2, 25, 0, 590);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, img_1);
    			append_dev(button, t0);
    			append_dev(button, h3);
    			append_dev(h3, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*upgrade*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*img*/ 2 && !src_url_equal(img_1.src, img_1_src_value = /*img*/ ctx[1])) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (dirty & /*name*/ 1) {
    				toggle_class(img_1, "scaleUp", /*name*/ ctx[0] == 'Robot02');
    			}

    			if (dirty & /*target_cost*/ 16 && t1_value !== (t1_value = /*target_cost*/ ctx[4].toFixed(5) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*too_expensive*/ 4) {
    				toggle_class(button, "tooExpensive", /*too_expensive*/ ctx[2]);
    			}

    			if (dirty & /*not_defined*/ 8) {
    				toggle_class(button, "not_defined", /*not_defined*/ ctx[3]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(25:0) {#if !not_defined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = !/*not_defined*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*not_defined*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let target_cost;
    	let $upgrade_costs;
    	let $score;
    	let $cost_multiplier;
    	let $multipliers;
    	let $increments;
    	validate_store(upgrade_costs, 'upgrade_costs');
    	component_subscribe($$self, upgrade_costs, $$value => $$invalidate(6, $upgrade_costs = $$value));
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(7, $score = $$value));
    	validate_store(cost_multiplier, 'cost_multiplier');
    	component_subscribe($$self, cost_multiplier, $$value => $$invalidate(8, $cost_multiplier = $$value));
    	validate_store(multipliers, 'multipliers');
    	component_subscribe($$self, multipliers, $$value => $$invalidate(9, $multipliers = $$value));
    	validate_store(increments, 'increments');
    	component_subscribe($$self, increments, $$value => $$invalidate(10, $increments = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Upgrade', slots, []);
    	let { name = 'none' } = $$props;
    	let { img } = $$props;
    	let too_expensive = false;
    	let not_defined = false;

    	const upgrade = () => {
    		set_store_value(increments, $increments[name] *= $multipliers[name], $increments);
    		set_store_value(score, $score -= $upgrade_costs[name], $score);
    		set_store_value(upgrade_costs, $upgrade_costs[name] *= $cost_multiplier, $upgrade_costs);
    	};

    	const writable_props = ['name', 'img'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Upgrade> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('img' in $$props) $$invalidate(1, img = $$props.img);
    	};

    	$$self.$capture_state = () => ({
    		score,
    		costs,
    		increments,
    		multipliers,
    		upgrade_costs,
    		cost_multiplier,
    		name,
    		img,
    		too_expensive,
    		not_defined,
    		upgrade,
    		target_cost,
    		$upgrade_costs,
    		$score,
    		$cost_multiplier,
    		$multipliers,
    		$increments
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('img' in $$props) $$invalidate(1, img = $$props.img);
    		if ('too_expensive' in $$props) $$invalidate(2, too_expensive = $$props.too_expensive);
    		if ('not_defined' in $$props) $$invalidate(3, not_defined = $$props.not_defined);
    		if ('target_cost' in $$props) $$invalidate(4, target_cost = $$props.target_cost);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 1) {
    			{
    				$$invalidate(3, not_defined = name == 'none');
    			}
    		}

    		if ($$self.$$.dirty & /*$upgrade_costs, name, $score*/ 193) {
    			$$invalidate(2, too_expensive = $upgrade_costs[name] > $score);
    		}

    		if ($$self.$$.dirty & /*$upgrade_costs, name*/ 65) {
    			$$invalidate(4, target_cost = $upgrade_costs[name]);
    		}
    	};

    	return [
    		name,
    		img,
    		too_expensive,
    		not_defined,
    		target_cost,
    		upgrade,
    		$upgrade_costs,
    		$score
    	];
    }

    class Upgrade extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { name: 0, img: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Upgrade",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*img*/ ctx[1] === undefined && !('img' in props)) {
    			console.warn("<Upgrade> was created without expected prop 'img'");
    		}
    	}

    	get name() {
    		throw new Error("<Upgrade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Upgrade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get img() {
    		throw new Error("<Upgrade>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set img(value) {
    		throw new Error("<Upgrade>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/InfoJuicer.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;
    const file$1 = "src/Components/InfoJuicer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (7:2) {#if padding}
    function create_if_block(ctx) {
    	let each_1_anchor;
    	let each_value = /*$info_map*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $info_map*/ 2) {
    				each_value = /*$info_map*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(7:2) {#if padding}",
    		ctx
    	});

    	return block;
    }

    // (9:6) {#each Object.keys(juicer) as key}
    function create_each_block_1$1(ctx) {
    	let h4;
    	let t0;
    	let t1_value = /*key*/ ctx[7] + "";
    	let t1;
    	let t2;
    	let t3_value = /*juicer*/ ctx[4][/*key*/ ctx[7]] + "";
    	let t3;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text("> ");
    			t1 = text(t1_value);
    			t2 = text(": ");
    			t3 = text(t3_value);
    			attr_dev(h4, "class", "svelte-ptxiaq");
    			add_location(h4, file$1, 9, 8, 218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(h4, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$info_map*/ 2 && t1_value !== (t1_value = /*key*/ ctx[7] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$info_map*/ 2 && t3_value !== (t3_value = /*juicer*/ ctx[4][/*key*/ ctx[7]] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(9:6) {#each Object.keys(juicer) as key}",
    		ctx
    	});

    	return block;
    }

    // (8:4) {#each $info_map as juicer}
    function create_each_block$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Object.keys(/*juicer*/ ctx[4]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$info_map, Object*/ 2) {
    				each_value_1 = Object.keys(/*juicer*/ ctx[4]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:4) {#each $info_map as juicer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*padding*/ ctx[0] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-ptxiaq");
    			toggle_class(div, "padded", /*padding*/ ctx[0]);
    			add_location(div, file$1, 5, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*padding*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*padding*/ 1) {
    				toggle_class(div, "padded", /*padding*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $info_map;
    	validate_store(info_map, 'info_map');
    	component_subscribe($$self, info_map, $$value => $$invalidate(1, $info_map = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoJuicer', slots, ['default']);
    	let { padding = false } = $$props;
    	const writable_props = ['padding'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfoJuicer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('padding' in $$props) $$invalidate(0, padding = $$props.padding);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ padding, info_map, $info_map });

    	$$self.$inject_state = $$props => {
    		if ('padding' in $$props) $$invalidate(0, padding = $$props.padding);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [padding, $info_map, $$scope, slots];
    }

    class InfoJuicer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { padding: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoJuicer",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get padding() {
    		throw new Error("<InfoJuicer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<InfoJuicer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (221:4) <InfoJuicer>
    function create_default_slot_3(ctx) {
    	let div3;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div1;
    	let div1_style_value;
    	let t1;
    	let div2;
    	let div2_style_value;
    	let t2;
    	let span;
    	let t3_value = "highscore: " + /*$highscore*/ ctx[9].toFixed(5) + "₿" + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			span = element("span");
    			t3 = text(t3_value);
    			attr_dev(div0, "class", "space_content space__dust svelte-162t9na");
    			attr_dev(div0, "style", div0_style_value = `background-image: url("/assets/dust/${/*dust*/ ctx[7]}.png")`);
    			add_location(div0, file, 222, 8, 5814);
    			attr_dev(div1, "class", "space_content space__stars svelte-162t9na");
    			attr_dev(div1, "style", div1_style_value = `background-image: url("/assets/stars/${/*stars*/ ctx[8]}.png")`);
    			add_location(div1, file, 226, 8, 5953);
    			attr_dev(div2, "class", "space_content space__planet svelte-162t9na");
    			attr_dev(div2, "style", div2_style_value = `background-image: url("/assets/planets/${/*planet*/ ctx[6]}.gif")`);
    			add_location(div2, file, 230, 8, 6094);
    			attr_dev(div3, "class", "space svelte-162t9na");
    			add_location(div3, file, 221, 6, 5786);
    			attr_dev(span, "class", "highscore_box svelte-162t9na");
    			add_location(span, file, 235, 6, 6250);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*dust*/ 128 && div0_style_value !== (div0_style_value = `background-image: url("/assets/dust/${/*dust*/ ctx[7]}.png")`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty[0] & /*stars*/ 256 && div1_style_value !== (div1_style_value = `background-image: url("/assets/stars/${/*stars*/ ctx[8]}.png")`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (dirty[0] & /*planet*/ 64 && div2_style_value !== (div2_style_value = `background-image: url("/assets/planets/${/*planet*/ ctx[6]}.gif")`)) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty[0] & /*$highscore*/ 512 && t3_value !== (t3_value = "highscore: " + /*$highscore*/ ctx[9].toFixed(5) + "₿" + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(221:4) <InfoJuicer>",
    		ctx
    	});

    	return block;
    }

    // (214:2) <Container title="[eco footprint]" grow={1}>
    function create_default_slot_2(ctx) {
    	let infojuicer0;
    	let t0;
    	let span;
    	let button0;
    	let button1;
    	let t3;
    	let infojuicer1;
    	let current;
    	let mounted;
    	let dispose;
    	infojuicer0 = new InfoJuicer({ props: { padding: true }, $$inline: true });

    	infojuicer1 = new InfoJuicer({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(infojuicer0.$$.fragment);
    			t0 = space();
    			span = element("span");
    			button0 = element("button");
    			button0.textContent = "🌌";
    			button1 = element("button");
    			button1.textContent = "🌠";
    			t3 = space();
    			create_component(infojuicer1.$$.fragment);
    			attr_dev(button0, "class", "svelte-162t9na");
    			add_location(button0, file, 216, 7, 5653);
    			attr_dev(button1, "class", "svelte-162t9na");
    			add_location(button1, file, 216, 47, 5693);
    			attr_dev(span, "class", "svelte-162t9na");
    			add_location(span, file, 215, 4, 5640);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infojuicer0, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    			append_dev(span, button0);
    			append_dev(span, button1);
    			insert_dev(target, t3, anchor);
    			mount_component(infojuicer1, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*cycleDust*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*cycleStars*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const infojuicer1_changes = {};

    			if (dirty[0] & /*$highscore, planet, stars, dust*/ 960 | dirty[1] & /*$$scope*/ 8) {
    				infojuicer1_changes.$$scope = { dirty, ctx };
    			}

    			infojuicer1.$set(infojuicer1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infojuicer0.$$.fragment, local);
    			transition_in(infojuicer1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infojuicer0.$$.fragment, local);
    			transition_out(infojuicer1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infojuicer0, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t3);
    			destroy_component(infojuicer1, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(214:2) <Container title=\\\"[eco footprint]\\\" grow={1}>",
    		ctx
    	});

    	return block;
    }

    // (241:2) <Container title="main" grow={2} show_title={false}>
    function create_default_slot_1(ctx) {
    	let h2;
    	let t0_value = /*$score*/ ctx[0].toFixed(5) + "";
    	let t0;
    	let t1;
    	let t2;
    	let cookie_1;
    	let t3;
    	let h3;
    	let t4_value = /*$increments*/ ctx[10]["Cookie"].toFixed(6) + "";
    	let t4;
    	let t5;
    	let current;
    	let cookie_1_props = {};
    	cookie_1 = new Cookie({ props: cookie_1_props, $$inline: true });
    	/*cookie_1_binding*/ ctx[14](cookie_1);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = text(" ₿");
    			t2 = space();
    			create_component(cookie_1.$$.fragment);
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = text(" ₿/click");
    			attr_dev(h2, "class", "score ominous-hover-no-rotate per-click svelte-162t9na");
    			set_style(h2, "font-size", "40px");
    			add_location(h2, file, 241, 4, 6439);
    			attr_dev(h3, "class", "per-click ominous-hover-no-rotate svelte-162t9na");
    			add_location(h3, file, 245, 4, 6592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			insert_dev(target, t2, anchor);
    			mount_component(cookie_1, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t4);
    			append_dev(h3, t5);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*$score*/ 1) && t0_value !== (t0_value = /*$score*/ ctx[0].toFixed(5) + "")) set_data_dev(t0, t0_value);
    			const cookie_1_changes = {};
    			cookie_1.$set(cookie_1_changes);
    			if ((!current || dirty[0] & /*$increments*/ 1024) && t4_value !== (t4_value = /*$increments*/ ctx[10]["Cookie"].toFixed(6) + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cookie_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cookie_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			/*cookie_1_binding*/ ctx[14](null);
    			destroy_component(cookie_1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(241:2) <Container title=\\\"main\\\" grow={2} show_title={false}>",
    		ctx
    	});

    	return block;
    }

    // (250:2) <Container title="[miners]" grow={1}>
    function create_default_slot(ctx) {
    	let div0;
    	let clickerjuicer0;
    	let t0;
    	let clickerjuicer1;
    	let t1;
    	let clickerjuicer2;
    	let t2;
    	let clickerjuicer3;
    	let t3;
    	let h1;
    	let t5;
    	let div1;
    	let upgrade0;
    	let t6;
    	let upgrade1;
    	let t7;
    	let upgrade2;
    	let t8;
    	let upgrade3;
    	let current;

    	clickerjuicer0 = new ClickerJuicer({
    			props: {
    				len: /*clickers*/ ctx[2].length,
    				name: "Clicker",
    				description: "An extra mouse to click for you",
    				img: "/assets/btc_w_cursor.png",
    				display_name: "Clicker"
    			},
    			$$inline: true
    		});

    	clickerjuicer0.$on("buy", /*add*/ ctx[11]);

    	clickerjuicer1 = new ClickerJuicer({
    			props: {
    				len: /*gpus*/ ctx[5].length,
    				name: "GPU",
    				description: "A NoVidia graphics card to mine Bitcoin",
    				img: "/assets/gpu.gif",
    				display_name: "GPU"
    			},
    			$$inline: true
    		});

    	clickerjuicer1.$on("buy", /*add*/ ctx[11]);

    	clickerjuicer2 = new ClickerJuicer({
    			props: {
    				len: /*robot01s*/ ctx[3].length,
    				name: "Robot01",
    				description: "This Bitcoin mining robot will harvest Bitcoin for you",
    				img: "/assets/robot_1.gif",
    				display_name: "Crypto Bot"
    			},
    			$$inline: true
    		});

    	clickerjuicer2.$on("buy", /*add*/ ctx[11]);

    	clickerjuicer3 = new ClickerJuicer({
    			props: {
    				len: /*robot02s*/ ctx[4].length,
    				name: "Robot02",
    				description: "This Bitcoin mining drone will harvest Bitcoin for you",
    				img: "/assets/robot_2.gif",
    				display_name: "Crypto Drone"
    			},
    			$$inline: true
    		});

    	clickerjuicer3.$on("buy", /*add*/ ctx[11]);

    	upgrade0 = new Upgrade({
    			props: {
    				name: "Cookie",
    				img: "/assets/cursor_plus.png"
    			},
    			$$inline: true
    		});

    	upgrade1 = new Upgrade({
    			props: {
    				name: "Clicker",
    				img: "/assets/btc_w_cursor_plus.png"
    			},
    			$$inline: true
    		});

    	upgrade2 = new Upgrade({
    			props: {
    				name: "Robot01",
    				img: "/assets/robot1_plus.png"
    			},
    			$$inline: true
    		});

    	upgrade3 = new Upgrade({
    			props: {
    				name: "Robot02",
    				img: "/assets/robot2_plus.png"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(clickerjuicer0.$$.fragment);
    			t0 = space();
    			create_component(clickerjuicer1.$$.fragment);
    			t1 = space();
    			create_component(clickerjuicer2.$$.fragment);
    			t2 = space();
    			create_component(clickerjuicer3.$$.fragment);
    			t3 = space();
    			h1 = element("h1");
    			h1.textContent = "[upgrades]";
    			t5 = space();
    			div1 = element("div");
    			create_component(upgrade0.$$.fragment);
    			t6 = space();
    			create_component(upgrade1.$$.fragment);
    			t7 = space();
    			create_component(upgrade2.$$.fragment);
    			t8 = space();
    			create_component(upgrade3.$$.fragment);
    			attr_dev(div0, "class", "scroll svelte-162t9na");
    			add_location(div0, file, 250, 4, 6757);
    			add_location(h1, file, 285, 4, 7745);
    			attr_dev(div1, "class", "upgrades svelte-162t9na");
    			add_location(div1, file, 286, 4, 7769);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(clickerjuicer0, div0, null);
    			append_dev(div0, t0);
    			mount_component(clickerjuicer1, div0, null);
    			append_dev(div0, t1);
    			mount_component(clickerjuicer2, div0, null);
    			append_dev(div0, t2);
    			mount_component(clickerjuicer3, div0, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(upgrade0, div1, null);
    			append_dev(div1, t6);
    			mount_component(upgrade1, div1, null);
    			append_dev(div1, t7);
    			mount_component(upgrade2, div1, null);
    			append_dev(div1, t8);
    			mount_component(upgrade3, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const clickerjuicer0_changes = {};
    			if (dirty[0] & /*clickers*/ 4) clickerjuicer0_changes.len = /*clickers*/ ctx[2].length;
    			clickerjuicer0.$set(clickerjuicer0_changes);
    			const clickerjuicer1_changes = {};
    			if (dirty[0] & /*gpus*/ 32) clickerjuicer1_changes.len = /*gpus*/ ctx[5].length;
    			clickerjuicer1.$set(clickerjuicer1_changes);
    			const clickerjuicer2_changes = {};
    			if (dirty[0] & /*robot01s*/ 8) clickerjuicer2_changes.len = /*robot01s*/ ctx[3].length;
    			clickerjuicer2.$set(clickerjuicer2_changes);
    			const clickerjuicer3_changes = {};
    			if (dirty[0] & /*robot02s*/ 16) clickerjuicer3_changes.len = /*robot02s*/ ctx[4].length;
    			clickerjuicer3.$set(clickerjuicer3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clickerjuicer0.$$.fragment, local);
    			transition_in(clickerjuicer1.$$.fragment, local);
    			transition_in(clickerjuicer2.$$.fragment, local);
    			transition_in(clickerjuicer3.$$.fragment, local);
    			transition_in(upgrade0.$$.fragment, local);
    			transition_in(upgrade1.$$.fragment, local);
    			transition_in(upgrade2.$$.fragment, local);
    			transition_in(upgrade3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clickerjuicer0.$$.fragment, local);
    			transition_out(clickerjuicer1.$$.fragment, local);
    			transition_out(clickerjuicer2.$$.fragment, local);
    			transition_out(clickerjuicer3.$$.fragment, local);
    			transition_out(upgrade0.$$.fragment, local);
    			transition_out(upgrade1.$$.fragment, local);
    			transition_out(upgrade2.$$.fragment, local);
    			transition_out(upgrade3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(clickerjuicer0);
    			destroy_component(clickerjuicer1);
    			destroy_component(clickerjuicer2);
    			destroy_component(clickerjuicer3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			destroy_component(upgrade0);
    			destroy_component(upgrade1);
    			destroy_component(upgrade2);
    			destroy_component(upgrade3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(250:2) <Container title=\\\"[miners]\\\" grow={1}>",
    		ctx
    	});

    	return block;
    }

    // (294:2) {#each clickers as c}
    function create_each_block_3(ctx) {
    	let clicker_1;
    	let current;

    	clicker_1 = new Clicker({
    			props: { name: "Clicker" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(clicker_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clicker_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clicker_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clicker_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clicker_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(294:2) {#each clickers as c}",
    		ctx
    	});

    	return block;
    }

    // (297:2) {#each robot01s as c}
    function create_each_block_2(ctx) {
    	let clicker_1;
    	let current;

    	clicker_1 = new Clicker({
    			props: { name: "Robot01" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(clicker_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clicker_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clicker_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clicker_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clicker_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(297:2) {#each robot01s as c}",
    		ctx
    	});

    	return block;
    }

    // (300:2) {#each robot02s as c}
    function create_each_block_1(ctx) {
    	let clicker_1;
    	let current;

    	clicker_1 = new Clicker({
    			props: { name: "Robot02" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(clicker_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clicker_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clicker_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clicker_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clicker_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(300:2) {#each robot02s as c}",
    		ctx
    	});

    	return block;
    }

    // (303:2) {#each gpus as c}
    function create_each_block(ctx) {
    	let clicker_1;
    	let current;
    	clicker_1 = new Clicker({ props: { name: "GPU" }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(clicker_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(clicker_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clicker_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clicker_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(clicker_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(303:2) {#each gpus as c}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let t5;
    	let div1;
    	let container0;
    	let t6;
    	let container1;
    	let t7;
    	let container2;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let div2;
    	let h4;
    	let current;

    	container0 = new Container({
    			props: {
    				title: "[eco footprint]",
    				grow: 1,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container1 = new Container({
    			props: {
    				title: "main",
    				grow: 2,
    				show_title: false,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	container2 = new Container({
    			props: {
    				title: "[miners]",
    				grow: 1,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value_3 = /*clickers*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks_3[i], 1, 1, () => {
    		each_blocks_3[i] = null;
    	});

    	let each_value_2 = /*robot01s*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out_1 = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*robot02s*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_2 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*gpus*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_3 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Crypto Clicker";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Crypto Clicker";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Crypto Clicker";
    			t5 = space();
    			div1 = element("div");
    			create_component(container0.$$.fragment);
    			t6 = space();
    			create_component(container1.$$.fragment);
    			t7 = space();
    			create_component(container2.$$.fragment);
    			t8 = space();

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t9 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t10 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t12 = space();
    			div2 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Nathan Inbar && Justin Stitt";
    			attr_dev(h10, "class", "glitchy");
    			set_style(h10, "color", "white");
    			add_location(h10, file, 207, 2, 5380);
    			attr_dev(h11, "class", "glitchy");
    			add_location(h11, file, 208, 2, 5443);
    			attr_dev(h12, "class", "glitchy");
    			add_location(h12, file, 209, 2, 5485);
    			attr_dev(div0, "class", "title svelte-162t9na");
    			add_location(div0, file, 206, 0, 5358);
    			attr_dev(div1, "class", "content svelte-162t9na");
    			add_location(div1, file, 212, 0, 5533);
    			add_location(h4, file, 307, 2, 8373);
    			attr_dev(div2, "class", "footer svelte-162t9na");
    			add_location(div2, file, 306, 0, 8350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h10);
    			append_dev(div0, t1);
    			append_dev(div0, h11);
    			append_dev(div0, t3);
    			append_dev(div0, h12);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(container0, div1, null);
    			append_dev(div1, t6);
    			mount_component(container1, div1, null);
    			append_dev(div1, t7);
    			mount_component(container2, div1, null);
    			append_dev(div1, t8);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div1, null);
    			}

    			append_dev(div1, t9);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(div1, t10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div1, null);
    			}

    			append_dev(div1, t11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container0_changes = {};

    			if (dirty[0] & /*$highscore, planet, stars, dust*/ 960 | dirty[1] & /*$$scope*/ 8) {
    				container0_changes.$$scope = { dirty, ctx };
    			}

    			container0.$set(container0_changes);
    			const container1_changes = {};

    			if (dirty[0] & /*$increments, cookie, $score*/ 1027 | dirty[1] & /*$$scope*/ 8) {
    				container1_changes.$$scope = { dirty, ctx };
    			}

    			container1.$set(container1_changes);
    			const container2_changes = {};

    			if (dirty[0] & /*robot02s, robot01s, gpus, clickers*/ 60 | dirty[1] & /*$$scope*/ 8) {
    				container2_changes.$$scope = { dirty, ctx };
    			}

    			container2.$set(container2_changes);

    			if (dirty[0] & /*clickers*/ 4) {
    				each_value_3 = /*clickers*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    						transition_in(each_blocks_3[i], 1);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						transition_in(each_blocks_3[i], 1);
    						each_blocks_3[i].m(div1, t9);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_3.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*robot01s*/ 8) {
    				each_value_2 = /*robot01s*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div1, t10);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*robot02s*/ 16) {
    				each_value_1 = /*robot02s*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div1, t11);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (dirty[0] & /*gpus*/ 32) {
    				each_value = /*gpus*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_3(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container0.$$.fragment, local);
    			transition_in(container1.$$.fragment, local);
    			transition_in(container2.$$.fragment, local);

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container0.$$.fragment, local);
    			transition_out(container1.$$.fragment, local);
    			transition_out(container2.$$.fragment, local);
    			each_blocks_3 = each_blocks_3.filter(Boolean);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			destroy_component(container0);
    			destroy_component(container1);
    			destroy_component(container2);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $score;
    	let $info_map;
    	let $highscore;
    	let $cost_multiplier;
    	let $costs;
    	let $increments;
    	validate_store(score, 'score');
    	component_subscribe($$self, score, $$value => $$invalidate(0, $score = $$value));
    	validate_store(info_map, 'info_map');
    	component_subscribe($$self, info_map, $$value => $$invalidate(15, $info_map = $$value));
    	validate_store(highscore, 'highscore');
    	component_subscribe($$self, highscore, $$value => $$invalidate(9, $highscore = $$value));
    	validate_store(cost_multiplier, 'cost_multiplier');
    	component_subscribe($$self, cost_multiplier, $$value => $$invalidate(16, $cost_multiplier = $$value));
    	validate_store(costs, 'costs');
    	component_subscribe($$self, costs, $$value => $$invalidate(17, $costs = $$value));
    	validate_store(increments, 'increments');
    	component_subscribe($$self, increments, $$value => $$invalidate(10, $increments = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let cookie;
    	let clicker;
    	let clickers = Array(0);
    	let robot01s = Array(0);
    	let robot02s = Array(0);
    	let gpus = Array(0);

    	const add = event => {
    		var n = event.detail.name;

    		if ($costs[n] > $score) {
    			return;
    		}

    		set_store_value(score, $score -= $costs[n], $score);
    		set_store_value(costs, $costs[n] *= $cost_multiplier, $costs);

    		if (n == "Clicker") {
    			addClicker();
    		} else if (n == "Robot01") {
    			addRobot01();
    		} else if (n == "Robot02") {
    			addRobot02();
    		} else if (n == "GPU") {
    			addGPU();
    		}
    	};

    	// [`Cookie Increment: ${$cookie_increment}`, ]
    	let planet = 0;

    	let dust = 0;
    	let stars = 0;

    	const cycleDust = () => {
    		if (dust == 2) {
    			$$invalidate(7, dust = 0);
    			return;
    		}

    		$$invalidate(7, dust++, dust);
    	};

    	const cycleStars = () => {
    		if (stars == 7) {
    			$$invalidate(8, stars = 0);
    			return;
    		}

    		$$invalidate(8, stars++, stars);
    	};

    	const updateEcoInfo = () => {
    		switch (true) {
    			case planet == 0:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Normal", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Normal", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Functioning", $info_map);
    				break;
    			case planet == 1:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Toxic", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Reduced", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Chaos", $info_map);
    				break;
    			case planet == 2:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Lethal", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Endangered", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Apocalypse", $info_map);
    				break;
    			case planet == 3:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Disintegrated", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Extinct", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Extinct", $info_map);
    				break;
    			case planet == 4:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Non-existant", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Extinct", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Extinct", $info_map);
    				break;
    			case planet == 5:
    				set_store_value(info_map, $info_map[0].Stage = "Planet", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Non-existant", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Extinct", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Extinct", $info_map);
    				break;
    			case planet == 6:
    				set_store_value(info_map, $info_map[0].Stage = "Star", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Not Applicable", $info_map);
    				break;
    			case planet == 7:
    				set_store_value(info_map, $info_map[0].Stage = "Galaxy", $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Not Applicable", $info_map);
    				break;
    			case planet == 8:
    				set_store_value(info_map, $info_map[0].Stage = "Black Hole", $info_map);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				set_store_value(info_map, $info_map[0].Atmosphere = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0]["Flora/Fauna"] = "Not Applicable", $info_map);
    				set_store_value(info_map, $info_map[0].Civilization = "Not Applicable", $info_map);
    				break;
    		}
    	};

    	const updateSpaceScene = score => {
    		//update planet based on score
    		const updatePlanet = planetID => {
    			if (planet > planetID) {
    				return;
    			}

    			$$invalidate(6, planet = planetID);
    			updateEcoInfo();
    		};

    		let emission_factor = 31.4 + 31.4 * $highscore;

    		if (isNaN(emission_factor)) {
    			emission_factor = 524;
    		}

    		let emissions = ((planet + 1) * emission_factor).toFixed(3);

    		switch (true) {
    			case score >= 10000:
    				updatePlanet(8);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				break;
    			case score >= 5000:
    				updatePlanet(7);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				break;
    			case score >= 2500:
    				updatePlanet(6);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				break;
    			case score >= 1250:
    				updatePlanet(5);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				break;
    			case score >= 625:
    				updatePlanet(4);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `Not Applicable`, $info_map);
    				break;
    			case score >= 312:
    				updatePlanet(3);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `${emissions}T lbs/sec`, $info_map);
    				break;
    			case score >= 156:
    				updatePlanet(2);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `${emissions}B lbs/sec`, $info_map);
    				break;
    			case score >= 75:
    				updatePlanet(1);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `${emissions}M lbs/sec`, $info_map);
    				break;
    			default:
    				updatePlanet(0);
    				set_store_value(info_map, $info_map[0]["C02 Emissions"] = `${emissions} tons`, $info_map);
    		}
    	};

    	const addClicker = () => {
    		$$invalidate(2, clickers = [...clickers, 0]);
    	};

    	const addRobot01 = () => {
    		$$invalidate(3, robot01s = [...robot01s, 0]);
    	};

    	const addRobot02 = () => {
    		$$invalidate(4, robot02s = [...robot02s, 0]);
    	};

    	const addGPU = () => {
    		$$invalidate(5, gpus = [...gpus, 0]);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function cookie_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			cookie = $$value;
    			$$invalidate(1, cookie);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Container,
    		Cookie,
    		Clicker,
    		ClickerJuicer,
    		Upgrade,
    		score,
    		costs,
    		increments,
    		info_map,
    		cost_multiplier,
    		highscore,
    		InfoJuicer,
    		cookie,
    		clicker,
    		clickers,
    		robot01s,
    		robot02s,
    		gpus,
    		add,
    		planet,
    		dust,
    		stars,
    		cycleDust,
    		cycleStars,
    		updateEcoInfo,
    		updateSpaceScene,
    		addClicker,
    		addRobot01,
    		addRobot02,
    		addGPU,
    		$score,
    		$info_map,
    		$highscore,
    		$cost_multiplier,
    		$costs,
    		$increments
    	});

    	$$self.$inject_state = $$props => {
    		if ('cookie' in $$props) $$invalidate(1, cookie = $$props.cookie);
    		if ('clicker' in $$props) clicker = $$props.clicker;
    		if ('clickers' in $$props) $$invalidate(2, clickers = $$props.clickers);
    		if ('robot01s' in $$props) $$invalidate(3, robot01s = $$props.robot01s);
    		if ('robot02s' in $$props) $$invalidate(4, robot02s = $$props.robot02s);
    		if ('gpus' in $$props) $$invalidate(5, gpus = $$props.gpus);
    		if ('planet' in $$props) $$invalidate(6, planet = $$props.planet);
    		if ('dust' in $$props) $$invalidate(7, dust = $$props.dust);
    		if ('stars' in $$props) $$invalidate(8, stars = $$props.stars);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$score*/ 1) {
    			{
    				updateSpaceScene($score);
    			}
    		}
    	};

    	return [
    		$score,
    		cookie,
    		clickers,
    		robot01s,
    		robot02s,
    		gpus,
    		planet,
    		dust,
    		stars,
    		$highscore,
    		$increments,
    		add,
    		cycleDust,
    		cycleStars,
    		cookie_1_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
