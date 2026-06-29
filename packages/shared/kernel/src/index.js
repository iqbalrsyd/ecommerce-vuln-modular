const path = require("path");
const fs = require("fs");

class ModuleRegistry {
  constructor() {
    this.modules = new Map();
    this.services = new Map();
  }

  register(mod) {
    if (!mod || !mod.name) {
      throw new Error("module must have a name");
    }
    this.modules.set(mod.name, mod);
    if (mod.services) {
      for (const [key, value] of Object.entries(mod.services)) {
        this.services.set(`${mod.name}.${key}`, value);
      }
    }
    console.log(`[kernel] registered module ${mod.name}@${mod.version || "0.0.0"}`);
  }

  get(moduleName) {
    return this.modules.get(moduleName);
  }

  service(fqn) {
    return this.services.get(fqn);
  }

  all() {
    return Array.from(this.modules.values());
  }
}

function buildContext(registry, db, bus, config) {
  return {
    db,
    events: bus,
    config,
    services: new Proxy(
      {},
      {
        get: (_, fqn) => registry.service(fqn),
      },
    ),
  };
}

function loadModulesFrom(dir) {
  const modules = [];
  if (!fs.existsSync(dir)) return modules;
  for (const entry of fs.readdirSync(dir)) {
    const pkgJson = path.join(dir, entry, "package.json");
    const indexJs = path.join(dir, entry, "src", "index.js");
    if (!fs.existsSync(pkgJson) || !fs.existsSync(indexJs)) continue;
    try {
      const mod = require(indexJs);
      if (mod && mod.name) {
        modules.push({ name: mod.name, mod, dir: path.join(dir, entry) });
      }
    } catch (err) {
      console.error(`[kernel] failed to load ${entry}: ${err.message}`);
    }
  }
  return modules;
}

module.exports = { ModuleRegistry, buildContext, loadModulesFrom };
