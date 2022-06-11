const getOptions = (token: string) => ({
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${token}`,
  },
});

const getOrganizations = async (token: string): Promise<any> => {
  // const url = 'https://api.github.com/search/repositories?q=user:erikbg7';
  // const url = 'https://api.github.com/users/erikbg7/repos';
  const url = 'https://api.github.com/user/orgs';
  // const url = 'https://api.github.com/users/erikblanca/events';
  const orgs = await fetch(url, getOptions(token)).then((res) => res.json());
  const first = orgs[0];

  const url2 = 'https://api.github.com/orgs/'.concat(first.login, '/repos');
  const repos = await fetch(url2, getOptions(token)).then((res) => res.json());
  // const o = orgs.map((a: any) => a?.repo?.name);
  console.log('List');
  console.log({ orgs, repos });
  return orgs.map((o = {} as any) => {
    if (o.id && o.login) {
      return { id: o.id, name: o.login };
    }
  });
};

const getProjects = async (token: string, groupId: string): Promise<any> => {
  // /orgs/{org}/repos
  return [];
};

const getAllProjectsMembers = async (token: string, projectIds: string[]) => {
  return [];
};

export { getOrganizations, getProjects, getAllProjectsMembers };
