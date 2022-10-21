const Apify = require("apify");
const { log } = Apify.utils;
const { social } = Apify.utils;
const constants = require("./constants");
const utils = require("./utility");

module.exports = async ({ page, request, session, response }) => {
  log.info(`Starting data extraction for ${request.url}`);

  /* const captchaFrame = await page.frames().find(f => f.name().startsWith('a-'));
    if (captchaFrame) {
        const hasCaptcha = await captchaFrame.waitForSelector('div.recaptcha-checkbox-border');
        if (hasCaptcha) {
            session.retire();
            throw 'Got captcha, page will be retried. If this happens often, consider increasing number of proxies';
        }
    } */

  /*  const statusCode = +response.status();
  if (statusCode >= 400) {
    session.retire();
    throw `Response status is: ${response.status()} msg: ${response.statusText()}`;
  }

  if (await page.$(".yt-upsell-dialog-renderer")) {
    await page.evaluate(async () => {
      const noThanks = document.querySelectorAll('.yt-upsell-dialog-renderer [role="button"]');

      for (const button of noThanks) {
        if (button.textContent && button.textContent.includes("No thanks")) {
          button.click();
          break;
        }
      }
    });
  }

  if (page.url().includes("consent")) {
    log.debug("Clicking consent dialog");

    await Promise.all([
      page.$eval('form[action*="consent"]', (el) => {
        el.querySelector("button")?.click();
      }),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    session.retire();
  } */

  const { CHANNEL_NAME_XP, CHANNEL_LINK1_XP, CHANNEL_LINK2_XP, CHANNEL_PANELS_XP, CHANNEL_LINK3_XP, CHANNEL_LINK4_XP, CHANNEL_LINK5_XP, CHANNEL_SUBSCRIBER_COUNT_XP, CHANNEL_DESCRIPTION_XP, CHANNEL_PROFILE_IMAGE_XP } = constants.SELECTORS_XP;

  var channelName = "";
  var channelDescription = "";
  var channelProfileImage = "";
  var channelSubscriberCount = "";
  var channelLink1 = "";
  var channelLink2 = "";
  var channelLink3 = "";
  var channelLink4 = "";
  var channelLink5 = "";
  var youtubeUrls = [];
  var instagramUrls = [];
  var facebookUrls = [];
  var twitterUrls = [];
  var tiktokUrls = [];
  var twitchUrls = [];
  var snapchatUrls = [];
  var pinterestUrls = [];
  var redditUrls = [];
  var discordUrls = [];
  var onlyfansUrls = [];
  var tumblrUrls = [];
  var patreonUrls = [];
  var spotifyUrls = [];
  var soundcloudUrls = [];
  var linkedinUrls = [];
  var verifiedCategory = "";

  var channelName = await utils.getDataFromXpath(page, CHANNEL_NAME_XP, "innerHTML").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelName-failed"));
  log.debug(`Got channelName as ${channelName}`);

  try {
    var channelSubscriberCount = await utils
      .getDataFromXpath(page, CHANNEL_SUBSCRIBER_COUNT_XP, "innerText")
      .then((str) => utils.unformatNumbers(str))
      .catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelSubscriberCount-failed"));
    log.debug(`Got channelSubscriberCount as ${channelSubscriberCount}`);
  } catch (e) {
    log.debug(`Got channelSubscriberCount as ${channelSubscriberCount}`);
  }

  try {
    var channelLink1 = await utils.getDataFromXpath(page, CHANNEL_LINK1_XP, "href").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelLink1-failed"));
    log.debug(`Got channelLink1 as ${channelLink1}`);
  } catch (e) {
    log.debug("No channelLink1 found");
  }

  try {
    var channelLink2 = await utils.getDataFromXpath(page, CHANNEL_LINK2_XP, "href").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelLink2-failed"));
    log.debug(`Got channelLink2 as ${channelLink2}`);
  } catch (e) {
    log.debug("No channelLink2 found");
  }

  try {
    var channelLink3 = await utils.getDataFromXpath(page, CHANNEL_LINK3_XP, "href").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelLink3-failed"));
    log.debug(`Got channelLink3 as ${channelLink3}`);
  } catch (e) {
    log.debug("No channelLink3 found");
  }

  try {
    var channelLink4 = await utils.getDataFromXpath(page, CHANNEL_LINK4_XP, "href").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelLink4-failed"));
    log.debug(`Got channelLink4 as ${channelLink4}`);
  } catch (e) {
    log.debug("No channelLink4 found");
  }

  try {
    var channelLink5 = await utils.getDataFromXpath(page, CHANNEL_LINK5_XP, "href").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelLink5-failed"));
    log.debug(`Got channelLink5 as ${channelLink5}`);
  } catch (e) {
    log.debug("No channelLink5 found");
  }

  try {
    var channelDescription = await utils.getDataFromXpath(page, CHANNEL_DESCRIPTION_XP, "innerHTML").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelDescription-failed"));
    log.debug(`Got channelDescription as ${channelDescription}`);
  } catch (e) {
    log.debug("No channelDescription found");
  }

  try {
    var channelPanels = await utils.getDataFromXpath(page, CHANNEL_PANELS_XP, "innerHTML").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelPanels-failed"));
    log.debug(`Got channelPanels as ${channelPanels}`);
  } catch (e) {
    log.debug("No channelPanels found");
  }
  /* 
  //add channelLink1, channelLink2, channelLink3, channelLink4, channelLink5, to an array called channelLinks
  var channelLinks = await [channelLink1.href, channelLink2.href, channelLink3, channelLink4, channelLink5];
 */
  //find social links in channelLinks array

  var channelProfileImageURL = await utils.getDataFromXpath(page, CHANNEL_PROFILE_IMAGE_XP, "src").catch((e) => utils.handleErrorAndScreenshot(page, e, "Getting-channelProfileImage-failed"));
  log.debug(`Got channelProfileImage as ${channelProfileImageURL}`);

  var allUrls = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a"));
    return anchors.map((anchor) => anchor.href);
  });

  try {
    var twitchUrls = Apify.utils.social.getTwitchUrls(channelLinks);
    log.debug(`Got twitchUrls as ${twitchUrls}`);
  } catch (e) {
    log.debug("No twitchUrls found");
  }

  var verifiedCategory = await page.evaluate(() => {
    var xpathCategory = document.evaluate('//*[@aria-label="Verified Partner"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (xpathCategory === null) {
      return null;
    } else {
      return "Verified Partner";
    }
  });
  log.debug(`Got verifiedCategory as ${verifiedCategory}`);

  var channelURL = request.url.replace("/about", "");

  //search channelPanels for an email using APify.utilssocial.emailsFromText

  var channelPanelsText = await page.evaluate((channelPanels) => channelPanels.textContent, channelPanels);
  log.debug(`Got channelPanelsText as ${channelPanelsText}`);

  var emails = await Apify.utils.social.emailsFromText(channelPanelsText);

  log.debug(`Got emails as ${emails.join(",")}`);

  var channelEmail = Apify.utils.social.emailsFromText(channelPanels);
  log.debug(`Got email as ${channelEmail}`);

  var channelPhone = Apify.utils.social.phonesFromText(channelPanels);
  log.debug(`Got phone as ${channelPhone}`);

  const socialHandles = social.parseHandlesFromHtml(channelPanels || channelLink1 || channelLink2 || channelLink3 || channelLink4 || channelLink5);
  log.debug("Social handles: ", socialHandles);

  log.debug("Pushing item to dataset");

  await Apify.pushData({
    channelURL,
    channelName,
    channelSubscriberCount,
    channelDescription,
    channelProfileImageURL,
    socialHandles,
    verifiedCategory,
  });

  log.info(`Finished data extraction for ${request.url}`);
};
