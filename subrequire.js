'use strict';

var parentModule = module.parent;

function subrequire(id)
{
    if (typeof id !== 'string' || !id)
        throw TypeError('Argument must be a non-empty string');
    var Module = parentModule.constructor;
    var cache = Module._cache;
    var filename = Module._resolveFilename(id, parentModule);
    var cachedModule = cache[filename];
    var _require = parentModule.require;
    cache[filename] = undefined;
    try
    {
        var exports = _require(filename);
        return exports;
    }
    finally
    {
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

    var id = module.id;
    delete require.cache[id];
    var childModules = parentModule !== undefined ? parentModule.children : [];
    var subrequireModule = findChildModuleById();
    if (subrequireModule)
    {
        module.exports = subrequireModule.exports;
        removeChildModule();
    }
    else
        module.exports = subrequire;
}
)();
