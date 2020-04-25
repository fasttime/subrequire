'use strict';

var _Array_prototype_push_apply;
var _Function_prototype_call_apply;

var CJS_VAR_NAMES = ['this', 'exports', 'require', 'module', '__filename', '__dirname'];

var parentModule = module.parent;

function postrequire(id, stubs)
{
    if (typeof id !== 'string' || !id)
        throw TypeError('First argument must be a non-empty string');
    if (stubs !== undefined && typeof stubs !== 'object')
        throw TypeError('Second argument must be an object, undefined or null');
    var Module = parentModule.constructor;
    var cache = Module._cache;
    var filename = Module._resolveFilename(id, parentModule);
    var cachedModule = cache[filename];
    var _require = parentModule.require;
    cache[filename] = undefined;
    var indexedStubs = [];
    if (stubs !== undefined && stubs !== null)
    {
        CJS_VAR_NAMES.forEach
        (
            function (stubName, index)
            {
                if (stubName in stubs)
                    indexedStubs[index] = stubs[stubName];
            }
        );
    }
    if (indexedStubs.length)
    {
        var prototype = Function.prototype;
        var apply = prototype.apply;
        var call = prototype.call;
        var applyCall =
        function (fn, args)
        {
            if (typeof fn !== 'function')
                throw TypeError('Invalid operation');
            if (fn.length === 5 && fn.name === '')
            {
                prototype.apply = apply;
                prototype.call = call;
                prototype = undefined;
                indexedStubs.forEach
                (
                    function (stub, index)
                    {
                        args[index] = stub;
                    }
                );
            }
            var returnValue = _Function_prototype_call_apply(fn, args);
            return returnValue;
        };
        (
            prototype.apply =
            function apply(thisArg, args) // eslint-disable-line func-names
            {
                var applyCallArgs = [thisArg];
                _Array_prototype_push_apply(applyCallArgs, args);
                var returnValue = applyCall(this, applyCallArgs);
                return returnValue;
            }
        ).prototype = undefined;
        (
            prototype.call =
            function call(thisArg) // eslint-disable-line func-names, no-unused-vars
            {
                var returnValue = applyCall(this, arguments);
                return returnValue;
            }
        ).prototype = undefined;
    }
    try
    {
        var exports = _require(filename);
        return exports;
    }
    finally
    {
        if (prototype !== undefined)
        {
            prototype.apply = apply;
            prototype.call = call;
        }
        if (cachedModule !== undefined)
            cache[filename] = cachedModule;
        else
            delete cache[filename];
    }
}

(function ()
{
    function findChildModuleById()
    {
        for (var index = childModules.length; index > 0;)
        {
            var childModule = childModules[--index];
            if (childModule !== module && childModule.id === id)
                return childModule;
        }
    }

    function removeChildModule()
    {
        for (var index = childModules.length; index > 0;)
        {
            if (childModules[--index] === module)
                childModules.splice(index, 1);
        }
    }

    var _Function_prototype = Function.prototype;
    var _Function_prototype_apply = _Function_prototype.apply;
    _Array_prototype_push_apply = _Function_prototype_apply.bind(Array.prototype.push);
    _Function_prototype_call_apply = _Function_prototype_apply.bind(_Function_prototype.call);

    var id = module.id;
    delete require.cache[id];
    if (parentModule !== undefined)
        var childModules = parentModule.children;
    if (childModules === undefined)
        childModules = [];
    var postrequireModule = findChildModuleById();
    if (postrequireModule)
    {
        module.exports = postrequireModule.exports;
        removeChildModule();
    }
    else
        module.exports = postrequire;
}
)();
