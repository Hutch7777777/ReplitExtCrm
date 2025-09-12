import { Client } from '@microsoft/microsoft-graph-client';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=outlook',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Outlook not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableOutlookClient() {
  const accessToken = await getAccessToken();

  return Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => accessToken
    }
  });
}

// Helper functions for common email operations
export async function sendEmail(to: string, subject: string, content: string, cc?: string[]) {
  const client = await getUncachableOutlookClient();
  
  const message = {
    subject,
    body: {
      contentType: 'Text',
      content
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ],
    ccRecipients: cc?.map(email => ({
      emailAddress: {
        address: email
      }
    })) || []
  };

  return await client.api('/me/sendMail').post({
    message
  });
}

export async function getEmails(folder = 'inbox', top = 25) {
  const client = await getUncachableOutlookClient();
  
  return await client
    .api(`/me/mailFolders/${folder}/messages`)
    .top(top)
    .select('id,subject,from,receivedDateTime,bodyPreview,isRead')
    .orderby('receivedDateTime desc')
    .get();
}

export async function getCalendarEvents(startTime?: string, endTime?: string) {
  const client = await getUncachableOutlookClient();
  
  let query = client.api('/me/events').select('id,subject,start,end,attendees,location');
  
  if (startTime && endTime) {
    query = query.filter(`start/dateTime ge '${startTime}' and end/dateTime le '${endTime}'`);
  }
  
  return await query.orderby('start/dateTime').get();
}

export async function createCalendarEvent(subject: string, start: string, end: string, attendees?: string[], location?: string) {
  const client = await getUncachableOutlookClient();
  
  const event = {
    subject,
    start: {
      dateTime: start,
      timeZone: 'UTC'
    },
    end: {
      dateTime: end,
      timeZone: 'UTC'
    },
    attendees: attendees?.map(email => ({
      emailAddress: {
        address: email
      }
    })) || [],
    location: location ? {
      displayName: location
    } : undefined
  };

  return await client.api('/me/events').post(event);
}
