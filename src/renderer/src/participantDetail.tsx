import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';

// Type declaration for window.api
declare global {
  interface Window {
    api: {
      participant: {
        getFirebaseDetails: (competitorId: number) => Promise<{
          success: boolean;
          data?: any;
          error?: string;
        }>;
      };
    };
  }
}

type ParticipantDetails = {
  participant: IKFParticipant | null;
  bouts: Array<{
    boutId: string;
    eventId: number;
    eventName: string;
    opponent: string;
    result: 'won' | 'lost' | 'pending';
    corner: 'red' | 'blue';
  }>;
  wins: number;
  losses: number;
  events: Array<{ id: number; name: string }>;
  gymName: string | null;
};

function ParticipantDetailApp() {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ParticipantDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParticipantDetails = async () => {
      try {
        // Get competitor ID from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const competitorId = urlParams.get('competitorId');

        if (!competitorId) {
          setError('No competitor ID provided');
          setLoading(false);
          return;
        }

        const result = await window.api.participant.getFirebaseDetails(
          parseInt(competitorId)
        );

        if (result.success) {
          setDetails(result.data);
        } else {
          setError(result.error || 'Failed to load participant details');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadParticipantDetails();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: '#fff' }}>
          Loading participant details...
        </Typography>
      </Container>
    );
  }

  if (error || !details || !details.participant) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, bgcolor: '#2d2d2d' }}>
          <Typography variant="h6" color="error">
            Error loading participant
          </Typography>
          <Typography variant="body1" sx={{ color: '#fff', mt: 2 }}>
            {error || 'Participant not found'}
          </Typography>
        </Paper>
      </Container>
    );
  }

  const { participant, bouts, wins, losses, events, gymName } = details;

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: '#90caf9',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}>
        {title}
      </Typography>
      {children}
    </Box>
  );

  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <Box sx={{ display: 'flex', mb: 1.5 }}>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', minWidth: 150 }}>
        {label}:
      </Typography>
      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, bgcolor: '#1e1e1e', color: '#fff' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
            {participant.firstName} {participant.lastName}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {participant.profileName}
          </Typography>
        </Box>

        {/* Record Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            label={`${wins}W - ${losses}L`}
            color="primary"
            sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
          />
          <Chip label={`${events.length} Events`} color="secondary" />
          {gymName && <Chip label={gymName} color="info" />}
        </Box>

        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Personal Information */}
        <InfoSection title="Personal Information">
          <InfoRow label="Email" value={participant.email} />
          <InfoRow label="Date of Birth" value={formatDate(participant.dob)} />
          <InfoRow label="Gender" value={participant.gender} />
          <InfoRow label="Phone" value={participant.phoneNumber || 'Not provided'} />
        </InfoSection>

        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Competition Info */}
        <InfoSection title="Competition Stats">
          <InfoRow
            label="Weight"
            value={participant.weight ? `${participant.weight} lbs` : 'N/A'}
          />
          <InfoRow
            label="Height"
            value={participant.height ? `${participant.height} in` : 'N/A'}
          />
          <InfoRow label="Record" value={`${wins} Wins, ${losses} Losses`} />
          <InfoRow label="Win Rate" value={wins + losses > 0 ? `${((wins / (wins + losses)) * 100).toFixed(1)}%` : 'N/A'} />
        </InfoSection>

        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Events Participated */}
        <InfoSection title="Events Participated">
          {events.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No events found
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {events.map((event) => (
                <Box
                  key={event.id}
                  sx={{
                    p: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 1,
                  }}>
                  <Typography variant="body2" sx={{ color: '#fff' }}>
                    {event.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </InfoSection>

        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Bout History */}
        <InfoSection title="Bout History">
          {bouts.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No bouts found
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bouts.map((bout, index) => (
                <Paper
                  key={bout.boutId}
                  sx={{
                    p: 2,
                    bgcolor: bout.result === 'won' 
                      ? 'rgba(76, 175, 80, 0.1)' 
                      : bout.result === 'lost'
                      ? 'rgba(244, 67, 54, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid',
                    borderColor: bout.result === 'won'
                      ? 'rgba(76, 175, 80, 0.3)'
                      : bout.result === 'lost'
                      ? 'rgba(244, 67, 54, 0.3)'
                      : 'rgba(255, 255, 255, 0.1)',
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <Box>
                      <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', mb: 0.5 }}>
                        vs. {bout.opponent}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {bout.eventName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.5)',
                          mt: 0.5,
                        }}>
                        {bout.corner === 'red' ? 'Red Corner' : 'Blue Corner'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      {bout.result === 'won' ? (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Won"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ) : bout.result === 'lost' ? (
                        <Chip
                          icon={<CancelIcon />}
                          label="Lost"
                          color="error"
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      ) : (
                        <Chip label="Pending" color="default" size="small" />
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </InfoSection>

        {/* System IDs */}
        <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
        <InfoSection title="System IDs">
          <InfoRow label="Competitor ID" value={participant.competitorId} />
          <InfoRow label="Participant ID" value={participant.participantId} />
          <InfoRow label="Person ID" value={participant.personId} />
        </InfoSection>
      </Paper>
    </Container>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ParticipantDetailApp />
  </React.StrictMode>
);
