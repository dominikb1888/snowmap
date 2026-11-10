
{ pkgs, lib, config, inputs, ... }:

{
  # 1. Install Node.js (Observable Framework requires Node v18+)
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22; # Recommending LTS Node 22
    pnpm.enable = true;       # Enable PNPM if you prefer it over NPM
  };

  # 2. Additional global packages needed for specialized data loaders
  packages = [
    pkgs.git
    # pkgs.python3         # Uncomment if you use Python data loaders
    # pkgs.rWrapper        # Uncomment if you use R data loaders
  ];

  # 3. Automation: Automatically install dependencies upon entering the shell
  enterShell = ''
    echo "⚡ Welcome to your Observable Framework environment!"
    if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
      echo "📦 Installing project dependencies..."
      pnpm install # Swap to 'npm install' or 'yarn install' if needed
    fi
    if ! grep -q '"@eslint/js"' package.json 2>/dev/null; then
      echo "📥 Installing required ESLint configuration packages..."
      npm install --save-dev @eslint/js globals
    fi
    if [ ! -f eslint.config.js ]; then
      echo "📦 Generating standard eslint.config.js for Observable..."
      cat << 'EOF' > eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
  {
    ignores: ["dist/"],
  },
];
EOF
      echo "✅ Created eslint.config.js"
    fi
  '';

  # 4. Process Management: Run 'devenv up' to boot the preview server automatically
  processes = {
    observable-dev.exec = "pnpm run dev"; # Runs 'observable preview' under the hood
  };

  # 5. Convenient scripts for your workflow
  scripts = {
    build-site.exec = "pnpm run build"; # Compiles the static site into /dist
    deploy-site.exec = "pnpm run deploy"; # Deploys to Observable Cloud
    init-observable.exec = ''
    # 1. Prevent running if the app is already initialized
    if [ -f "observablehq.config.js" ] || [ -f "observablehq.config.ts" ]; then
      echo "❌ Observable Framework config already exists. Setup aborted."
      exit 1
    fi

    echo "🏗️ Creating temporary workspace..."
    TMP_DIR=$(mktemp -d -t observable-XXXXXX)

    # 2. Run the interactive installer inside the temp directory
    echo "📦 Running Observable Framework template creator..."
    # ADDED '--only-built-dependencies' configuration via pnpm flag inline to authorize builds
    if ! (cd "$TMP_DIR" && npx --yes --package=pnpm pnpm dlx @observablehq/framework@latest create -- --only-built-dependencies esbuild); then
      echo "❌ Observable creation failed. Cleaning up..."
      rm -rf "$TMP_DIR"
      exit 1
    fi

    # 3. Move files back to the project root
    echo "🚚 Merging generated files into project root..."
    
    # Enable dotglob to ensure hidden files are copied
    shopt -s dotglob
    
    for item in "$TMP_DIR"/*; do
      [ -e "$item" ] || break
      
      filename=$(basename "$item")
      
      # Skip moving if it conflicts with critical devenv files
      if [ "$filename" = "devenv.nix" ] || [ "$filename" = "devenv.yaml" ] || [ "$filename" = ".devenv" ]; then
        echo "⚠️ Skipping $filename to preserve your devenv environment."
        continue
      fi
      
      # Handle package.json safely if you already have one
      if [ "$filename" = "package.json" ] && [ -f "package.json" ]; then
        echo "📝 Found existing package.json. Saving as backup..."
        mv "$item" "package.json.generated"
        echo "💡 Created 'package.json.generated'. Please merge this with your existing package.json."
        continue
      fi

      # Move everything else
      mv "$item" "./"
    done
    
    shopt -u dotglob

    # 4. Cleanup
    echo "🧹 Cleaning up temporary files..."
    rm -rf "$TMP_DIR"

    echo "✅ Success! Observable Framework files have been integrated."
    echo "👉 Run 'pnpm approve-builds esbuild' followed by 'devenv up' to start."
  '';
  };
  
  # 2. Automated Testing Environment
  # This runs whenever you invoke `devenv test` (locally or in CI)
  enterTest = ''
    echo "🧪 Running Observable build validation..."
    # Ensure the framework can successfully build the static site without errors
    npm run build

    echo "🔬 Running project unit tests..."
    # Executes your test runner (e.g., vitest, node --test, or jest)
    npm test
  '';

  # 3. Git Pre-Commit Hooks
  # Hooks auto-install on `devenv shell` and run on `git commit`
  git-hooks.hooks = {
    # Format markdown, javascript, and config files
    prettier = {
      enable = true;
      types_or = [ "javascript" "ts" "markdown" "json" "css" ];
    };

    # Catch syntax and architectural issues early
    eslint = {
      enable = true;
      files = "\\.(js|ts|jsx|tsx)$";
    };

    # Highly recommended for Observable: Catch unresolved merge conflicts in data/markdown files
    check-merge-conflicts.enable = true;
  };

  # Optional: Define your local development preview process
  processes.preview.exec = "npm run dev"; 
  
}

