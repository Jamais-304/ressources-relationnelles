export class GitHubIssueService {
  token: string
  owner: string
  repo: string
  baseUrl: string

  constructor() {
    this.token = import.meta.env.VITE_GITHUB_TOKEN;
    this.owner = import.meta.env.VITE_GITHUB_REPO_OWNER;
    this.repo = import.meta.env.VITE_GITHUB_REPO_NAME;
    this.baseUrl = 'https://api.github.com';
  }

  async createUserIssue(
    username: string,
    email: string,
    title: string,
    description: string) {
    const issue = {
      title: `Formulaire de ticket : ${title} – (utilisateur "${username}")`,
      body: this.formatIssueBody(username, email, description),
      labels: ['S:Support', 'Pending-Triage']
    };

    const response = await fetch(`${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    });

    return await response.json();
  }

  formatIssueBody(username: string, email: string, description: string) {
    return `
**Créé par :** ${username}
**Date de création :** ${new Date().toISOString()}
**Contact :** ${email}

---

${description}

---
*Ce ticket a été créé depuis l’application et nécessite d’être triée et assignée.*
`;
  }
}
