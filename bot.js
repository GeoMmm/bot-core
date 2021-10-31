const puppeteer = require('puppeteer');
const querystring = require('querystring');
const url = require('url');


(async () => {
  const browser = await puppeteer.launch({ headless: false }); // default is true
  const page = await browser.newPage();
  await page.setViewport({
  	width: 1024,
	height:960,
	deviceScaleFactor: 1,
	});

// get the search term  CANT WORK THIS OUT
/*  const url = await page.url();
  const search_params = url.searchParams;
  const term = search_params.req.url("term")						// CONFIGURE parameter names 
  const pageurl = search_params.get("pageurl")
*/
const term="sale";
const pageurl="https://animalskinsandbones.com/"

// open page and search for term
  await page.goto(pageurl);  
  await page.type('input[name=s]', term);
  await page.keyboard.press('\n');

  
// get number of results
  await page.waitForSelector('p.woocommerce-result-count');
  let element = await page.$('p.woocommerce-result-count');
  let strNResults = await page.evaluate(el => el.textContent, element);
  let arrNResults = strNResults.split(" ");
  const intMaxResults = eval(arrNResults[3]);
  console.log("MaxResults = " + intMaxResults);
  
  let arrShowResults = (arrNResults[1]).split("–");
  let intMinShowResults = eval(arrShowResults[0]);
  let intMaxShowResults = eval(arrShowResults[1]);
  console.log("Showing " + intMinShowResults + " ... " + intMaxShowResults);
    
  const selectors = await page.$$("product-title");
  console.log(selectors.length); // number of selectors found on this page

// select first result
  elem = await page.waitForXPath("//span[contains(@class, 'product-title')]");
  await elem.click();
  await page.waitForTimeout(3000);

// go PgDn and take a screenshot
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
