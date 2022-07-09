/**
 * Version: 1.0.1
 * Settings added protection strengthened
 * Developed by kubi
 */

// Modules
const express = require("express"),
bodyParser = require("body-parser"),
path = require("path"),
fs = require("fs"),
{ exec } = require('node:child_process'),
moment = require('moment')
require("moment-duration-format"),
{ Strategy } = require("passport-discord"),
passport = require("passport"),
session = require("express-session"),
fetch = require("axios")

//Database
const { kubitdb } = require("kubitdb")
const db = new kubitdb("database/index")
const komutlardb = new kubitdb("database/komutlar")
const tdb = new kubitdb("database/temp")
const sdb = new kubitdb('settings')
const settings = require('./settings.json')

//Start
const app = express();
app.listen(settings.port);
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'utils/dashboard/public')));
if(settings["2ad"]){
app.use(session({secret: 'simplediscord',resave: true,saveUninitialized: true}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
const strategy = new Strategy(
{clientID: settings.id,clientSecret: settings.websitetoken,
callbackURL: setttings.domain+`/login`,scope: ["identify"]},
(_access_token, _refresh_token, user, done) =>process.nextTick(() => done(null, user)),);
passport.use(strategy);}
const c = require('ansi-colors');
console.log(c.bgBlue.bold("Simple Discord started"))

//Setup
function allsetup(){
fs.rmSync(path.join(__dirname,'/bot'), { recursive: true, force: true });
fs.mkdirSync(path.join(__dirname,'/bot')) 
fs.mkdirSync(path.join(__dirname,'/bot/komutlar')) 
exec('cd bot && npm init -y && npm i discord.js kubitdb fs node-os-utils && node . > konsol.txt', (err, stdout, stderr) => {})
var indexjs = `//Version ${settings.version} | Powerded by kubi
const { Client, Intents , Collection,  Util, MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');const Discord = require('discord.js');
const settings = require('../settings.json')
const {kubitdb} = require('kubitdb')
const kdb = new kubitdb("../database/komutlar")
const tempdb = new kubitdb("../database/temp")
const db = new kubitdb("../database/bot")
const fs = require('fs')
const osu = require('node-os-utils')
const client = new Client({ intents: [
Intents.FLAGS.GUILDS,
Intents.FLAGS.GUILD_MEMBERS,
Intents.FLAGS.GUILD_BANS,
Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
Intents.FLAGS.GUILD_INTEGRATIONS,
Intents.FLAGS.GUILD_WEBHOOKS,
Intents.FLAGS.GUILD_INVITES,
Intents.FLAGS.GUILD_VOICE_STATES,
Intents.FLAGS.GUILD_PRESENCES,
Intents.FLAGS.GUILD_MESSAGES,
Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
Intents.FLAGS.GUILD_MESSAGE_TYPING,
Intents.FLAGS.DIRECT_MESSAGES,
Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
Intents.FLAGS.DIRECT_MESSAGE_TYPING
]});
client.login(settings.token).catch((e)=>{console.log("❌ Token hatalı\\n"+e)});
console.log("Sunucu başladı Dangerio Studio")
client.on('ready', () => {
console.log("İnvite Link: https://discord.com/api/oauth2/authorize?client_id=${settings.id}&permissions=8&scope=bot%20applications.commands")
console.log("Bot Hazır: "+client.user.tag);
setInterval(() => {try {if(tempdb.get("reboot")) return process.exit(0);
tempdb.set("ram",(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))
tempdb.set("channels",client.channels.cache.size)
tempdb.set("guilds",client.guilds.cache.size)
tempdb.set("uptime",client.uptime)
tempdb.set("ping",client.ws.ping)
tempdb.set("members", client.guilds.cache.reduce((a, g) => a + g.memberCount, 0))
osu.cpu.usage().then(info => {tempdb.set("cpu",Number(info.toFixed(0)))})
osu.mem.info().then(i => {tempdb.set("ram",Number(((i.freeMemMb/i.totalMemMb)*100).toFixed(0)))})
}catch{}},5000)
});

kdb.get("komutlar").map((x)=>{
console.log("Yükenen komut:"+x.ismi)
fs.writeFileSync('komutlar/'+x.ismi+'.js',"const { Client, Intents , Collection,  Util, MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');const Discord = require('discord.js');"+
"\\nmodule.exports= (message,client,args,db,channel,role) => {\\n"+x.indexjs+"\\n}", err => { })
})
client.on('messageCreate', (message) => {
kdb.get("komutlar").map((xc)=>{var komut = xc.ismi
if(xc.prefix === true) komut = settings.prefix+xc.ismi
if (message.content.split(" ")[0] === komut) {
var args = message.content.replace(komut,"").split(" "),sayı;
if(tempdb.get("komutkullanımı")){tempdb.get("komutkullanımı").map(x =>  {
tempdb.set("komutkullanımı", tempdb.get("komutkullanımı").filter(z => z.id !== x.id))
if(x.id != message.author.id) tempdb.push("komutkullanımı",x)
if(tempdb.get("komutkullanımı").filter(z => z.id === message.author.id)[0]) {
sayı = tempdb.get("komutkullanımı").filter(z => z.id === message.author.id)[0]["sayı"]+1}
})}else {sayı = 1}
tempdb.push("komutkullanımı",{"id":message.author.id,"username":message.author.tag,"zaman":Date.now(),"komut":komut,"sayı":sayı})
var channel = message.mentions.channels.first(),role = message.mentions.roles.first()
require('./komutlar/'+xc.ismi+".js")(message,client,args,db,channel,role)}})
});
`
if(!komutlardb.get("komutlar")) fs.writeFile(path.join(__dirname,'/database/komutlar.json'),'{"komutlar":[]}', err => { })
if(!tdb.get("komutkullanımı")) fs.writeFile(path.join(__dirname,'/database/temp.json'),'{"komutkullanımı":[]}', err => { })
fs.writeFile(path.join(__dirname,'/bot/index.js'), String(indexjs), err => { })
console.log(c.green("Welcome to Simple Discord\n✅ Setup successful"))
}

function start(){
try{fs.readFileSync(path.join(__dirname,'/bot/package-lock.json'))}catch{return allsetup()}//Installer
try{fs.unlinkSync(path.join(__dirname,'bot/hata.txt'))}catch{}
try{fs.unlinkSync(path.join(__dirname,'bot/konsol.txt'))}catch{}
exec('cd bot && node . > konsol.txt', function(err, out){//Start
if(err === null && !err) return;
console.log("❌ "+c.red.bold("Hata\n"+err))
fs.writeFile(path.join(__dirname,'/bot/hata.txt'),err.toString(), err => { })})
}start()

function addcommad(ismi,prefix,indexjs,execc){
try{fs.unlinkSync(path.join(__dirname,'/bot/komutlar/'+ismi+".js"))}catch{}
komutlardb.set("komutlar",komutlardb.get("komutlar").filter(z=> z.ismi !== ismi))
komutlardb.push("komutlar",{"ismi":ismi,"prefix":prefix,"tarih":Date.now(),"indexjs":indexjs})
fs.writeFileSync('bot/komutlar/'+ismi+'.js',"const { Client, Intents , Collection,  Util, MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');const Discord = require('discord.js');"+
"\nmodule.exports= (message,client,args,db,channel,role) => {\n"+indexjs+"\n}", err => { })
if(execc){exec('cd bot && '+execc, function(err, out){})}
}
function debugtext(text) {if(text.includes("'") || text.includes(`"`) || text.includes('`')) {return true} else {return false}}

//Oh Express
app.get('/',(req, res) => {
res.render("index.ejs",{
uptime:moment.duration(tdb.get("uptime")).format(" D [gün], H [saat], m [dakika], s [saniye]"),
sunucu:tdb.get("guilds"),
ram:tdb.get("ram"),
üye:tdb.get("members"),
cpu:tdb.get("cpu"),
kanal:tdb.get("channels"),
ping:tdb.get("ping"),
total:((tdb.get("cpu")+tdb.get("ram"))/2).toFixed(0),
icons:settings.fontawesome,
botinvite:`https://discord.com/api/oauth2/authorize?client_id=${settings.id}&permissions=8&scope=bot%20applications.commands`
})
})
if(settings["2ad"]){
app.get('/login', passport.authenticate("discord", {failureRedirect: "/",}), async (req, res) => {
if(settings.ownerid != req.user.id) return res.redirect("/uyari/Aynı hesap değil")
req.session.user = req.user
res.redirect("/dashboard")
})}
app.get('/dashboard', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
var hatalog;try{hatalog= fs.readFileSync(path.join(__dirname,'/bot/hata.txt'))}catch{hatalog = "false"}
res.render("dashboard.ejs",{
sonkullanılanlar:tdb.get("komutkullanımı").sort((a,b)=>a.zaman-b.zaman).reverse(),
log:fs.readFileSync(path.join(__dirname,'/bot/konsol.txt')),
hata:hatalog,
settings:settings,
icons:settings.fontawesome,
encokkullanılan:tdb.get("komutkullanımı").sort((a,b)=>a.sayı-b.sayı).reverse(),
version:process.version,
package:JSON.parse(fs.readFileSync(path.join(__dirname,'/bot/package.json'))).dependencies,
botinvite:`https://discord.com/api/oauth2/authorize?client_id=${settings.id}&permissions=8&scope=bot%20applications.commands`})
})
app.use('/uyari/:user', function(req, res) {
res.render("uyarı.ejs", {uyarı:req.params.user.split("[altsatır]").join("\n")})
})

app.use('/deletecommand/:user', function(req, res) {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
try{fs.unlinkSync(path.join(__dirname,'/bot/komutlar/'+req.params.user+".js"))}catch{}
komutlardb.set("komutlar",komutlardb.get("komutlar").filter(z=> z.ismi !== req.params.user))
res.redirect("/komutlar")
})
app.use('/not2adview', function(req, res) {
res.write(`<iframe src="http://localhost" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; 
border:none; margin:0; padding:0; overflow:hidden; z-index:999999;">
</iframe>`);res.end()})
app.get('/out', async (req, res) => {
if(settings["2ad"]){req.session.user = ""}
res.redirect("/")
})
app.get('/komutlar', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
res.render("komutlar.ejs",{
komutlardb:komutlardb,
icons:settings.fontawesome,
sonkullanılanlar:tdb.get("komutkullanımı").sort((a,b)=>a.sayı-b.sayı).reverse(),
moment:moment
})})
app.get('/komutekle', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
res.render("komutekle.ejs",{
icons:settings.fontawesome,
data:"false"
})})
app.use('/komutduzenle/:komutismi', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
if(!req.params.komutismi || !komutlardb.get("komutlar").filter(z=> z.ismi===req.params.komutismi)[0]){return res.redirect("/uyari/Komut bulunamadı")}
res.render("komutekle.ejs",{
icons:settings.fontawesome,
data:komutlardb.get("komutlar").filter(z=> z.ismi===req.params.komutismi)[0]
})})
app.post('/komutlarekle', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
var args=req.body,code,msgynt="message.channel.send({",prefix,terminal=args["terminal"]; 
if(!args["terminal"]) terminal = "";var ecode = "new Discord.MessageEmbed()";
if(!args.ismi || args.ismi ==="" || args.ismi ===" " || debugtext(args.ismi)){return res.redirect("/uyari/Kodun ismini doğru girin")}
if(args.jskodu && args.jskodu !="" && args.jskodu !=" ") code = code+"///javascript\n"+args.jskodu+"\n///javascript\n"
//Eylemler
if(args.mesajsil === "true") code = code + "message.delete();\n"
if(args.kanalsil === "true") code = code + "message.channel.delete();\n"
if(args.mesajyanıt === "true") msgynt = "message.reply({"
//Embed
 if(args["embed-aciklama"] || args["embed-başlık"] || args["embed-renk"] || args["embed-resim"] || args["embed-kücük-resim"]) {
 if(args.mesajyanıt === "true") return res.redirect("/uyari/Mesajı yanıtlarken embed kullanamazsınız")
 if(args["embed-renk"]) ecode = ecode+"\n"+`.setColor("${args["embed-renk"]}")`
  if(args["embed-resim"]) {//resimler
  if(!args["embed-resim"].includes("https://") && !args["embed-resim"].includes("http://")) args["embed-resim"] = "https://"+args["embed-resim"]
  if(!args["embed-resim"].includes(".")) return res.redirect("/uyari/Lütfen düzgün bir resim linki giriniz") 
  ecode = ecode+"\n"+`.setImage("${args["embed-resim"]}")`}
  if(args["embed-kücük-resim"]) {//kücük resim
  if(!args["embed-kücük-resim"].includes("https://") && !args["embed-kücük-resim"].includes("http://")) args["embed-kücük-resim"] = "https://"+args["embed-kücük-resim"]
  if(!args["embed-kücük-resim"].includes(".")) return res.redirect("/uyari/Lütfen düzgün bir küçük resim linki giriniz") 
  ecode = ecode+"\n"+`.setThumbnail("${args["embed-kücük-resim"]}")`}
 if(!args["embed-başlık"].includes(`"`) && args["embed-başlık"]) ecode = ecode+"\n"+`.setTitle("${args["embed-başlık"].split("\`").join("\\\`")}")`
 if(!args["embed-aciklama"].includes(`"`) && args["embed-aciklama"]) ecode = ecode+"\n"+`.setDescription("${args["embed-aciklama"].split("\`").join("\\\`").split("[ALTSATIR]").join("\\n")}")`
 if(args["embed-renk"] && !args["embed-aciklama"] && !args["embed-başlık"]) return res.redirect("/uyari/Renk giriliyken yazı giremezsiniz siyah yapın")
 }
var normalmsg = args["mesajaga"];if(!normalmsg.includes(`"`) && normalmsg) normalmsg = normalmsg.split("\`").join("\\\`").split("[ALTSATIR]").join("\\n")
if(!args["mesajaga"]) normalmsg = " ";
code = (code+msgynt+"embeds:["+ecode+"],content:\""+normalmsg+"\"})").toString().split("undefined").join("")
if(args.prefix === "true") {prefix = true} else{ prefix = false}
addcommad(args.ismi,prefix,code,"npm i "+terminal)
console.log("🟢 Added a command:"+args.ismi)
return res.redirect("/uyari/Komut eklendi")
})
app.get('/ayarlar', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
res.render("ayarlar.ejs",{icons:settings.fontawesome,settings:sdb.hepsi()})})
app.post('/ayarlarupdate', async (req, res) => {
if(settings["2ad"]){if(!req.session.user || settings.ownerid != req.session.user.id) return res.redirect("/login")}
var args = req.body
if(args.token && args.token !="" && args.token !=" " && !debugtext(args.token)){
sdb.set("token",args.token)}
if(args.websitetoken && args.websitetoken !="" && args.websitetoken !=" " && !debugtext(args.websitetoken)){
sdb.set("websitetoken",args.websitetoken)}
if(args.id && args.id !="" && args.id !=" " && !debugtext(args.id) && !isNaN(Number(args.id))){sdb.set("id",Number(args.id))}
if(args.ownerid && args.ownerid !="" && args.ownerid !=" " && !debugtext(args.ownerid) && !isNaN(Number(args.ownerid))){
sdb.set("ownerid",Number(args.ownerid))}
if(args.prefix && args.prefix !="" && args.prefix !=" "){sdb.set("prefix",args.prefix)}
return res.redirect("/uyari/Ayarlar Güncellendi")
})