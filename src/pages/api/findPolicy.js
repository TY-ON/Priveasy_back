import { fetchHTML, findPrivacyPolicyLink } from '../../utils/crawler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { pageUrl } = req.body;

  if (!pageUrl) {
    return res.status(400).json({ error: 'Missing pageUrl parameter' });
  }

  try {
    const html = await fetchHTML(pageUrl);
    const policyLink = findPrivacyPolicyLink(html);

    if (!policyLink) {
      return res.status(404).json({ error: 'Privacy Policy link not found' });
    }

    res.status(200).json({ link: policyLink });
  } catch (error) {
    console.error('Error in findPolicy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
