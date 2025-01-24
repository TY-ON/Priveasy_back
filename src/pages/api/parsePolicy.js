import { extractPolicyContent } from '../../utils/crawler';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { policyLink } = req.body;

  if (!policyLink) {
    return res.status(400).json({ error: 'Missing policyLink parameter' });
  }

  try {
    const content = await extractPolicyContent(policyLink);

    if (!content) {
      return res.status(404).json({ error: 'Failed to extract content' });
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error('Error in parsePolicy:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
