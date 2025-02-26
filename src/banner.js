require("colors");

function displayHeader() {
  process.stdout.write("\x1Bc"); 

  console.log(`
            ${"██╗  ██╗ █████╗ ███████╗██╗   ██╗██╗  ██╗ █████╗".rainbow}  
            ${"██║ ██╔╝██╔══██╗╚══███╔╝██║   ██║██║  ██║██╔══██╗".cyan} 
            ${"█████╔╝ ███████║  ███╔╝ ██║   ██║███████║███████║".green} 
            ${"██╔═██╗ ██╔══██║ ███╔╝  ██║   ██║██╔══██║██╔══██║".yellow}  
            ${"██║  ██╗██║  ██║███████╗╚██████╔╝██║  ██║██║  ██║".blue}      
            ${"╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝".red}  

            ${"🔥 Join my Telegram:".bold} ${"@Offical_Im_kazuha".underline.brightCyan}
            ${"🌐 GitHub:".bold} ${"https://github.com/Kazuha787".underline.brightCyan}

            ${"✅ Automated Monad Faucet Claimer".bold}
            ${"✅ Supports multiple accounts from 'account.txt'".bold}
            ${"✅ Auto gas fee detection".bold}
            ${"✅ Randomized address transactions & new address generation".bold}
            ${"✅ Transactions may fail due to network congestion—this is normal".bold}
            ${"❤️  Support my work:".bold} ${"https://trakteer.id/Kazuha787/tip".underline.brightCyan}
  `.split("\n").join("\n")); 
}

module.exports = displayHeader;
