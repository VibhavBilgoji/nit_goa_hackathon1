#!/usr/bin/env node

/**
 * Quick Environment Variables Generator
 *
 * This script helps you quickly generate the required environment variables
 * for your CityPulse app deployment.
 *
 * Usage: node scripts/generate-env.js
 */

const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

// Generated values
const envVars = {};

/**
 * Print welcome message
 */
function printWelcome() {
  console.log("\n");
  console.log(
    colors.bold +
      colors.cyan +
      "╔══════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║         CityPulse - Environment Variables Generator         ║",
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════╝" +
      colors.reset,
  );
  console.log("\n");
  console.log(
    colors.yellow +
      "📝 This wizard will help you generate environment variables." +
      colors.reset,
  );
  console.log(
    colors.yellow +
      "   Press Enter to use default values or type your own." +
      colors.reset,
  );
  console.log("\n");
}

/**
 * Generate a secure random string
 */
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString("base64");
}

/**
 * Ask a question
 */
function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    const defaultText = defaultValue
      ? colors.cyan + ` (${defaultValue})` + colors.reset
      : "";

    rl.question(question + defaultText + ": ", (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

/**
 * Main setup flow
 */
async function main() {
  printWelcome();

  console.log(
    colors.bold + "🔴 CRITICAL VARIABLES (Required)\n" + colors.reset,
  );

  // JWT_SECRET
  const jwtSecret = generateSecret(32);
  console.log(colors.green + "✅ JWT_SECRET (auto-generated)" + colors.reset);
  console.log(
    colors.cyan + `   Value: ${jwtSecret.substring(0, 20)}...` + colors.reset,
  );
  envVars.JWT_SECRET = jwtSecret;
  console.log("");

  // NEXT_PUBLIC_APP_URL
  const appUrl = await ask(
    colors.yellow +
      "🌐 NEXT_PUBLIC_APP_URL" +
      colors.reset +
      "\n   Enter your Vercel deployment URL",
    "https://your-project.vercel.app",
  );
  envVars.NEXT_PUBLIC_APP_URL = appUrl;
  console.log("");

  console.log(
    colors.bold +
      "🟡 RECOMMENDED VARIABLES (Data Persistence)\n" +
      colors.reset,
  );
  console.log(
    colors.yellow +
      "   Skip these if you want to set up Supabase later" +
      colors.reset,
  );
  console.log("");

  // NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrl = await ask(
    colors.yellow +
      "🗄️  NEXT_PUBLIC_SUPABASE_URL" +
      colors.reset +
      "\n   Enter your Supabase project URL (or press Enter to skip)",
    "",
  );
  if (supabaseUrl) {
    envVars.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
  }
  console.log("");

  // NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (supabaseUrl) {
    const supabaseKey = await ask(
      colors.yellow +
        "🔑 NEXT_PUBLIC_SUPABASE_ANON_KEY" +
        colors.reset +
        "\n   Enter your Supabase anon key",
      "",
    );
    if (supabaseKey) {
      envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabaseKey;
    }
    console.log("");
  }

  console.log(
    colors.bold + "⚪ OPTIONAL VARIABLES (Enhanced Features)\n" + colors.reset,
  );
  const addOptional = await ask(
    colors.yellow +
      "❓ Do you want to add optional variables now?" +
      colors.reset +
      " (y/N)",
    "n",
  );
  console.log("");

  if (
    addOptional.toLowerCase() === "y" ||
    addOptional.toLowerCase() === "yes"
  ) {
    // GEMINI_API_KEY
    const geminiKey = await ask(
      colors.yellow +
        "🤖 GEMINI_API_KEY" +
        colors.reset +
        "\n   Google Gemini API key for AI categorization (press Enter to skip)",
      "",
    );
    if (geminiKey) {
      envVars.GEMINI_API_KEY = geminiKey;
    }
    console.log("");

    // NEXT_PUBLIC_MAPTILER_API_KEY
    const maptilerKey = await ask(
      colors.yellow +
        "🗺️  NEXT_PUBLIC_MAPTILER_API_KEY" +
        colors.reset +
        "\n   MapTiler API key for maps (press Enter to skip)",
      "",
    );
    if (maptilerKey) {
      envVars.NEXT_PUBLIC_MAPTILER_API_KEY = maptilerKey;
    }
    console.log("");

    // RESEND_API_KEY
    const resendKey = await ask(
      colors.yellow +
        "📧 RESEND_API_KEY" +
        colors.reset +
        "\n   Resend API key for email notifications (press Enter to skip)",
      "",
    );
    if (resendKey) {
      envVars.RESEND_API_KEY = resendKey;
    }
    console.log("");

    // Twilio
    const addTwilio = await ask(
      colors.yellow +
        "📱 Add Twilio for SMS notifications?" +
        colors.reset +
        " (y/N)",
      "n",
    );
    console.log("");

    if (addTwilio.toLowerCase() === "y" || addTwilio.toLowerCase() === "yes") {
      const twilioSid = await ask(
        colors.yellow + "📱 TWILIO_ACCOUNT_SID" + colors.reset,
        "",
      );
      if (twilioSid) {
        envVars.TWILIO_ACCOUNT_SID = twilioSid;
      }

      const twilioToken = await ask(
        colors.yellow + "🔐 TWILIO_AUTH_TOKEN" + colors.reset,
        "",
      );
      if (twilioToken) {
        envVars.TWILIO_AUTH_TOKEN = twilioToken;
      }

      const twilioPhone = await ask(
        colors.yellow +
          "📞 TWILIO_PHONE_NUMBER" +
          colors.reset +
          " (e.g., +1234567890)",
        "",
      );
      if (twilioPhone) {
        envVars.TWILIO_PHONE_NUMBER = twilioPhone;
      }
      console.log("");
    }
  }

  // Print results
  printResults();

  rl.close();
}

/**
 * Print the generated environment variables
 */
function printResults() {
  console.log("\n");
  console.log(
    colors.bold +
      colors.green +
      "✅ Environment Variables Generated!" +
      colors.reset,
  );
  console.log("\n");
  console.log(colors.bold + colors.cyan + "═".repeat(64) + colors.reset);
  console.log("\n");

  console.log(
    colors.bold +
      "📋 Copy these to your Vercel Environment Variables:\n" +
      colors.reset,
  );
  console.log(
    colors.cyan +
      "   (Settings → Environment Variables → Add New)" +
      colors.reset,
  );
  console.log("\n");

  console.log(colors.yellow + "─".repeat(64) + colors.reset);
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(
      `${colors.bold}${key}${colors.reset}=${colors.green}${value}${colors.reset}`,
    );
  });
  console.log(colors.yellow + "─".repeat(64) + colors.reset);

  console.log("\n");
  console.log(
    colors.bold +
      "📝 .env.local format (for local development):\n" +
      colors.reset,
  );
  console.log(colors.yellow + "─".repeat(64) + colors.reset);
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  console.log(colors.yellow + "─".repeat(64) + colors.reset);

  console.log("\n");
  console.log(colors.bold + "🚀 Next Steps:\n" + colors.reset);
  console.log(
    "   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables",
  );
  console.log("   2. Add each variable above (copy-paste the values)");
  console.log(
    '   3. Make sure to select "Production", "Preview", and "Development" for each',
  );
  console.log('   4. Click "Save" after adding each variable');
  console.log("   5. Redeploy your application");
  console.log("\n");

  console.log(
    colors.cyan +
      "📚 For detailed instructions, see: VERCEL_ENV_SETUP.md" +
      colors.reset,
  );
  console.log("\n");

  console.log(colors.bold + "⚠️  IMPORTANT:" + colors.reset);
  console.log(
    colors.yellow +
      "   - Keep these values secure and never commit them to Git" +
      colors.reset,
  );
  console.log(
    colors.yellow +
      "   - The JWT_SECRET is especially sensitive" +
      colors.reset,
  );
  console.log(
    colors.yellow +
      "   - For production, consider using different secrets" +
      colors.reset,
  );
  console.log("\n");
}

// Run the script
main().catch((error) => {
  console.error(colors.red + "❌ Error: " + error.message + colors.reset);
  process.exit(1);
});
