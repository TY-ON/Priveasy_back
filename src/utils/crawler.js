import axios from 'axios';
import cheerio from 'cheerio';

export const fetchHTML = async (url) => {
  try {
    const { data: html } = await axios.get(url);
    return html;
  } catch (error) {
    console.error(`Failed to fetch HTML from ${url}:`, error.message);
    throw new Error('Failed to fetch HTML');
  }
};

export const findPrivacyPolicyLink = (html) => {
  const $ = cheerio.load(html);
  let policyLink = null;

  $('footer a').each((_, element) => {
    const text = $(element).text().trim();
    if (text.includes('개인정보처리방침') || text.toLowerCase().includes('privacy policy')) {
      policyLink = $(element).attr('href');
      return false;
    }
  });

  if (!policyLink) {
    $('a').each((_, element) => {
      const text = $(element).text().trim();
      if (text.includes('개인정보처리방침') || text.toLowerCase().includes('privacy policy')) {
        policyLink = $(element).attr('href');
        return false;
      }
    });
  }

  return policyLink;
};

export const extractPolicyContent = async (url) => {
  const html = await fetchHTML(url);
  const $ = cheerio.load(html);
  return $('body').text().trim();
};
