// Google Apps Script proxy for FlyPredictome ortholog search
// Handles the CSRF token + session cookie flow that browsers can't do directly.
//
// DEPLOYMENT:
// 1. Go to https://script.google.com → New Project
// 2. Paste this entire code
// 3. Click Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy the deployment URL
// 5. Paste it in the Human Kinase-TF page settings (gear icon)

function doGet(e) {
  var gene = (e.parameter.gene || '').trim();
  var species = e.parameter.species || '9606';
  var geneType = e.parameter.type || 'Gene Symbol';

  if (!gene) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Missing gene parameter' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var orthoUrl = 'https://www.flyrnai.org/tools/fly_predictome/web/famdb_ortho_search/' + species;

    // Step 1: GET the form page to extract CSRF token + session cookie
    var getResp = UrlFetchApp.fetch(orthoUrl, { followRedirects: true, muteHttpExceptions: true });
    var html = getResp.getContentText();
    var headers = getResp.getAllHeaders();

    // Extract session cookies
    var setCookies = headers['Set-Cookie'];
    var cookieStr = '';
    if (setCookies) {
      if (typeof setCookies === 'string') setCookies = [setCookies];
      cookieStr = setCookies.map(function(c) { return c.split(';')[0]; }).join('; ');
    }

    // Extract CSRF token
    var tokenMatch = html.match(/form\[_token\].*?value="([^"]+)"/);
    if (!tokenMatch) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Cannot extract CSRF token' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Step 2: POST the search form with cookies
    var payload = {
      'form[gene_type]': geneType,
      'form[genelist]': gene,
      'form[submit]': '',
      'form[_token]': tokenMatch[1]
    };

    var postResp = UrlFetchApp.fetch(orthoUrl, {
      method: 'post',
      headers: { 'Cookie': cookieStr },
      payload: payload,
      followRedirects: true,
      muteHttpExceptions: true
    });

    var resultHtml = postResp.getContentText();

    // Check if results were found
    if (resultHtml.indexOf('fam_summary_table') === -1) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'No results found for ' + gene }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Return the full HTML (client will parse it)
    return ContentService.createTextOutput(resultHtml)
      .setMimeType(ContentService.MimeType.HTML);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
