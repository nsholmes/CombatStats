import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { IKFEvent } from '@nsholmes/combat-stats-types/event.model';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';
import React, { useEffect, useState } from 'react';

// Extend IKFParticipant to include profileId
type ExtendedIKFParticipant = IKFParticipant & { profileId?: string };
import { connect } from 'react-redux';
import {
  enrichIKFParticipants,
  fetchAllIKFParticipants,
  fetchIKFBrackets,
  fetchIKFEvents,
  fetchIKFParticipants,
  getAllIKFParticipants,
  getParticipantStatus,
  readIKFEvents,
  syncBracketsToFirebase,
  syncEventsToFirebase,
  syncParticipantsToFirebase,
  validateIKFToken,
} from '../Features/ikf.actions';
import {
  selectAllParticipants,
  selectAllParticipantsLoading,
  selectEnrichmentProgress,
  selectFetchAllProgress,
  selectIKFBrackets,
  selectIKFError,
  selectIKFEvents,
  selectIKFLoading,
  selectIKFParticipants,
  selectParticipantStatus,
  selectSelectedEvent,
  selectSyncEventsProgress,
  selectSyncStatus,
  selectTokenValidation,
  setSelectedEvent,
} from '../Features/ikf.slice';
import AllParticipantsList from '../Components/participants/AllParticipantsList';

interface IKFManagementProps {
  events: IKFEvent[];
  selectedEvent: IKFEvent | null;
  participants: IKFParticipant[];
  allParticipants: Array<IKFParticipant & { eventCount: number; eventIds: number[] }>;
  allParticipantsLoading: boolean;
  brackets: any[];
  loading: boolean;
  error: string | null;
  enrichmentProgress: any;
  fetchAllProgress: any;
  syncEventsProgress: any;
  syncStatus: any;
  participantStatus: any;
  tokenValidation: any;
  fetchEvents: () => void;
  readEvents: () => void;
  setSelectedEvent: (event: IKFEvent | null) => void;
  fetchParticipants: (eventUID: string, eventID: number) => void;
  fetchAllParticipants: () => void;
  getAllParticipants: () => void;
  fetchBrackets: (eventUID: string, eventID: number) => void;
  enrichParticipants: (eventId?: string, forceUpdate?: boolean) => void;
  syncEventsToFirebase: () => void;
  syncParticipantsToFirebase: (eventUID: string, eventID: number) => void;
  syncBracketsToFirebase: (eventUID: string, eventID: number) => void;
  getParticipantStatus: () => void;
  validateToken: () => void;
}

function IKFManagement(props: IKFManagementProps) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [newToken, setNewToken] = useState<string>('');
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Load events on mount
    props.readEvents();
    props.validateToken();
  }, []);

  useEffect(() => {
    // Sync local state with selected event from props
    if (props.selectedEvent) {
      setSelectedEventId(props.selectedEvent.id.toString());
    }
  }, [props.selectedEvent]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
    const event = props.events.find((e) => e.id.toString() === eventId);
    props.setSelectedEvent(event || null);
  };

  const handleViewAllParticipants = () => {
    setShowAllParticipants(true);
    props.getAllParticipants();
  };

  const handleParticipantClick = async (participant: IKFParticipant & { eventCount: number }) => {
    try {
      await window.api.participant.openDetailWindow(participant.competitorId);
    } catch (error) {
      console.error('Error opening participant detail window:', error);
    }
  };

  const getEmailsList = () => {
    return props.participants
      .filter(p => p.email && p.email.trim())
      .map(p => p.email)
      .join(', ');
  };

  const handleCopyEmails = async () => {
    const emailsList = getEmailsList();
    try {
      await navigator.clipboard.writeText(emailsList);
      setCopySuccess(true);
    } catch (error) {
      console.error('Failed to copy emails:', error);
    }
  };

  const handleExportCsv = async () => {
    const participantsWithEmail = props.participants.filter(p => p.email && p.email.trim());
    
    // Create CSV content with headers
    const headers = ['First Name', 'Last Name', 'Email', 'Weight', 'Height', 'Competitor ID'];
    const csvRows = [headers.join(',')];
    
    // Add participant data
    participantsWithEmail.forEach(p => {
      const row = [
        `"${p.firstName || ''}",`,
        `"${p.lastName || ''}",`,
        `"${p.email || ''}",`,
        `"${p.weight || ''}",`,
        `"${p.height || ''}",`,
        `"${p.competitorId}"`
      ].join('');
      csvRows.push(row);
    });
    
    const csvContent = csvRows.join('\n');
    const eventName = props.selectedEvent?.eventName.replace(/[^a-z0-9]/gi, '_') || 'participants';
    const defaultFileName = `${eventName}_participants.csv`;
    
    try {
      const result = await window.api.file.saveCsv(csvContent, defaultFileName);
      if (result.success) {
        setCopySuccess(true);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  // Events Tab
  const renderEventsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Event Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => props.fetchEvents()}
          disabled={props.loading}>
          Fetch Events from FSI
        </Button>
        <Button
          variant="outlined"
          onClick={() => props.readEvents()}
          disabled={props.loading}>
          Reload from Local File
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => props.syncEventsToFirebase()}
          disabled={
            props.loading ||
            props.syncEventsProgress?.status === 'running' ||
            props.events.length === 0
          }>
          Sync to Firebase
        </Button>
      </Box>

      {props.syncEventsProgress?.status === 'running' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Syncing events: {props.syncEventsProgress.currentEvent}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (props.syncEventsProgress.current /
                props.syncEventsProgress.total) *
              100
            }
          />
          <Typography variant="caption">
            {props.syncEventsProgress.current} /{' '}
            {props.syncEventsProgress.total}
          </Typography>
        </Box>
      )}

      {props.syncStatus?.events === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Events synced to Firebase successfully!
        </Alert>
      )}

      {props.loading && <CircularProgress />}

      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
        Total Events: {props.events.length}
      </Typography>

      <Paper sx={{ maxHeight: 400, overflow: 'auto', mt: 2, bgcolor: '#2d2d2d' }}>
        {props.events.map((event) => (
          <Box
            key={event.id}
            onClick={() => {
              props.setSelectedEvent(event);
              setSelectedEventId(event.id.toString());
            }}
            sx={{
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              bgcolor: props.selectedEvent?.id === event.id 
                ? 'rgba(144, 202, 249, 0.2)' 
                : 'transparent',
              '&:hover': { bgcolor: props.selectedEvent?.id === event.id
                ? 'rgba(144, 202, 249, 0.25)'
                : 'rgba(144, 202, 249, 0.08)' },
              transition: 'background-color 0.2s',
            }}>
            <Typography variant="subtitle1" sx={{ color: '#fff' }}>{event.eventName}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Date: {new Date(event.eventDate).toLocaleDateString()} | ID:{' '}
              {event.id}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );

  // Participants Tab
  const renderParticipantsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Participant Management
      </Typography>

      {props.selectedEvent && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'rgba(144, 202, 249, 0.15)',
            border: '1px solid rgba(144, 202, 249, 0.5)',
          }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
            Selected Event
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>Name:</strong> {props.selectedEvent.eventName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>Date:</strong>{' '}
            {new Date(props.selectedEvent.eventDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>ID:</strong> {props.selectedEvent.id} | <strong>UID:</strong>{' '}
            {props.selectedEvent.eventUid}
          </Typography>
        </Paper>
      )}

      <FormControl
        fullWidth
        sx={{
          mb: 3,
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#90caf9',
          },
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#90caf9',
            },
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}>
        <InputLabel>Select Event</InputLabel>
        <Select
          value={selectedEventId}
          onChange={(e) => handleEventSelect(e.target.value)}
          label="Select Event"
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#424242',
                '& .MuiMenuItem-root': {
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(144, 202, 249, 0.1)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(144, 202, 249, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(144, 202, 249, 0.3)',
                    },
                  },
                },
              },
            },
          }}>
          {props.events.map((event) => (
            <MenuItem key={event.id} value={event.id.toString()}>
              {event.eventName} - {new Date(event.eventDate).toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (props.selectedEvent) {
              props.fetchParticipants(
                props.selectedEvent.eventUid,
                props.selectedEvent.id
              );
            }
          }}
          disabled={!props.selectedEvent || props.loading}>
          Fetch Participants for Selected Event
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => props.fetchAllParticipants()}
          disabled={
            props.loading || props.fetchAllProgress.status === 'running'
          }>
          Fetch ALL Participants
        </Button>
        <Button
          variant="outlined"
          onClick={() => props.enrichParticipants()}
          disabled={
            props.loading || props.enrichmentProgress.status === 'running'
          }>
          Enrich with Profile IDs
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (props.selectedEvent) {
              props.syncParticipantsToFirebase(
                props.selectedEvent.eventUid,
                props.selectedEvent.id
              );
            }
          }}
          disabled={
            !props.selectedEvent ||
            props.loading ||
            props.participants.length === 0
          }>
          Sync to Firebase
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleViewAllParticipants}
          disabled={props.allParticipantsLoading}>
          View All Participants
        </Button>
        {showAllParticipants && (
          <Button
            variant="outlined"
            onClick={() => setShowAllParticipants(false)}>
            Back to Event View
          </Button>
        )}
        <Button
          variant="outlined"
          color="success"
          onClick={() => setShowEmailsModal(true)}
          disabled={props.participants.length === 0}>
          Copy Emails
        </Button>
      </Box>

      {props.syncStatus?.participants === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Participants synced to Firebase successfully!
        </Alert>
      )}

      {props.fetchAllProgress.status === 'running' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Fetching participants: {props.fetchAllProgress.currentEvent}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (props.fetchAllProgress.current / props.fetchAllProgress.total) *
              100
            }
          />
          <Typography variant="caption">
            {props.fetchAllProgress.current} / {props.fetchAllProgress.total}
          </Typography>
        </Box>
      )}

      {props.enrichmentProgress.status === 'running' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Enriching: {props.enrichmentProgress.currentName}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (props.enrichmentProgress.current /
                props.enrichmentProgress.total) *
              100
            }
          />
          <Typography variant="caption">
            {props.enrichmentProgress.current} / {props.enrichmentProgress.total}
          </Typography>
        </Box>
      )}

      {showAllParticipants ? (
        <AllParticipantsList
          participants={props.allParticipants}
          loading={props.allParticipantsLoading}
          onParticipantClick={handleParticipantClick}
        />
      ) : (
        <>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} gutterBottom>
            Loaded Participants: {props.participants.length}
          </Typography>

          {props.participants.length > 0 && (
        <Paper sx={{ maxHeight: 400, overflow: 'auto', mt: 2, bgcolor: '#2d2d2d' }}>
          {props.participants.map((p) => (
            <Box
              key={p.competitorId}
              sx={{
                p: 1.5,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Box>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  {p.firstName} {p.lastName}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {p.email || 'No email'} | Weight: {p.weight} | Height:{' '}
                  {p.height}
                </Typography>
              </Box>
              {(p as ExtendedIKFParticipant).profileId && (
                <Typography
                  variant="caption"
                  sx={{
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}>
                  Profile ID: {(p as ExtendedIKFParticipant).profileId}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>
          )}
        </>
      )}
    </Box>
  );

  // Brackets Tab
  const renderBracketsTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Bracket Management
      </Typography>

      {props.selectedEvent && (
        <Paper
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'rgba(144, 202, 249, 0.15)',
            border: '1px solid rgba(144, 202, 249, 0.5)',
          }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#fff' }}>
            Selected Event
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>Name:</strong> {props.selectedEvent.eventName}
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>Date:</strong>{' '}
            {new Date(props.selectedEvent.eventDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            <strong>ID:</strong> {props.selectedEvent.id} | <strong>UID:</strong>{' '}
            {props.selectedEvent.eventUid}
          </Typography>
        </Paper>
      )}

      <FormControl
        fullWidth
        sx={{
          mb: 3,
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#90caf9',
          },
          '& .MuiOutlinedInput-root': {
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#90caf9',
            },
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}>
        <InputLabel>Select Event</InputLabel>
        <Select
          value={selectedEventId}
          onChange={(e) => handleEventSelect(e.target.value)}
          label="Select Event"
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#424242',
                '& .MuiMenuItem-root': {
                  color: '#fff',
                  '&:hover': {
                    bgcolor: 'rgba(144, 202, 249, 0.1)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(144, 202, 249, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(144, 202, 249, 0.3)',
                    },
                  },
                },
              },
            },
          }}>
          {props.events.map((event) => (
            <MenuItem key={event.id} value={event.id.toString()}>
              {event.eventName} - {new Date(event.eventDate).toLocaleDateString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (props.selectedEvent) {
              props.fetchBrackets(
                props.selectedEvent.eventUid,
                props.selectedEvent.id
              );
            }
          }}
          disabled={!props.selectedEvent || props.loading}>
          Fetch Brackets for Selected Event
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            if (props.selectedEvent) {
              props.syncBracketsToFirebase(
                props.selectedEvent.eventUid,
                props.selectedEvent.id
              );
            }
          }}
          disabled={
            !props.selectedEvent || props.loading || props.brackets.length === 0
          }>
          Sync to Firebase
        </Button>
      </Box>

      {props.syncStatus?.brackets === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Brackets synced to Firebase successfully!
        </Alert>
      )}

      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mt: 2 }}>
        Loaded Brackets: {props.brackets.length}
      </Typography>

      {props.brackets.length > 0 && (
        <Paper sx={{ maxHeight: 400, overflow: 'auto', mt: 2, bgcolor: '#2d2d2d' }}>
          {props.brackets.map((bracket) => (
            <Box
              key={bracket.id}
              sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle2" sx={{ color: '#fff' }}>{bracket.name}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Weight: {bracket.compete_class_weight?.name} | Discipline:{' '}
                {bracket.discipline?.name} | Fighters:{' '}
                {bracket.fighterIds?.length || 0}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );

  // Status Tab
  const renderStatusTab = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Status
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Token Management
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="FSI Access Token"
            value={newToken}
            onChange={(e) => setNewToken(e.target.value)}
            placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            helperText="Enter the full Bearer token from FSI API"
            multiline
            rows={3}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#90caf9',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#90caf9',
                },
              },
              '& .MuiFormHelperText-root': {
                color: 'rgba(255, 255, 255, 0.6)',
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (newToken.trim()) {
                  try {
                    // Update token in service
                    await window.api.ikf.updateToken(newToken.trim());
                    // Store in localStorage as backup
                    localStorage.setItem('fsi_access_token', newToken.trim());
                    setNewToken('');
                    // Validate the new token
                    props.validateToken();
                  } catch (error) {
                    console.error('Failed to update token:', error);
                  }
                }
              }}
              disabled={!newToken.trim()}>
              Update Token
            </Button>
            <Button
              variant="outlined"
              onClick={() => props.validateToken()}>
              Validate Current Token
            </Button>
          </Box>
        </Box>

        {props.tokenValidation.lastChecked && (
          <Alert
            severity={props.tokenValidation.valid ? 'success' : 'error'}
            sx={{ mt: 2 }}>
            {props.tokenValidation.message}
            <Typography variant="caption" display="block">
              Last checked:{' '}
              {new Date(props.tokenValidation.lastChecked).toLocaleString()}
            </Typography>
          </Alert>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Participant Status
        </Typography>
        <Button
          variant="outlined"
          onClick={() => props.getParticipantStatus()}
          sx={{ mb: 2 }}>
          Check Participant Status
        </Button>
        {props.participantStatus && (
          <Box>
            <Typography variant="body2" gutterBottom>
              Events with participants:{' '}
              {props.participantStatus.eventsWithParticipants.length}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Events without participants:{' '}
              {props.participantStatus.eventsWithoutParticipants.length}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ p: 3, pb: 0 }}>
        IKF Management
      </Typography>

      {/* Emails Preview Modal */}
      <Dialog
        open={showEmailsModal}
        onClose={() => setShowEmailsModal(false)}
        maxWidth="md"
        fullWidth>
        <DialogTitle>Participant Emails</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            {props.participants.filter(p => p.email && p.email.trim()).length} emails found
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={getEmailsList()}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailsModal(false)}>Close</Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleExportCsv}>
            Export as CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCopyEmails}>
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Emails copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {props.error && (
        <Alert closeText='X' severity="error" sx={{ m: 3 }}>
          {props.error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .Mui-selected': {
              color: '#fff',
            },
          }}>
          <Tab label="Events" />
          <Tab label="Participants" />
          <Tab label="Brackets" />
          <Tab label="Status" />
        </Tabs>
      </Box>

      {tabValue === 0 && renderEventsTab()}
      {tabValue === 1 && renderParticipantsTab()}
      {tabValue === 2 && renderBracketsTab()}
      {tabValue === 3 && renderStatusTab()}
    </Box>
  );
}

const mapStateToProps = (state: any) => ({
  events: selectIKFEvents(state),
  selectedEvent: selectSelectedEvent(state),
  participants: selectIKFParticipants(state),
  allParticipants: selectAllParticipants(state),
  allParticipantsLoading: selectAllParticipantsLoading(state),
  brackets: selectIKFBrackets(state),
  loading: selectIKFLoading(state),
  error: selectIKFError(state),
  enrichmentProgress: selectEnrichmentProgress(state),
  fetchAllProgress: selectFetchAllProgress(state),
  syncEventsProgress: selectSyncEventsProgress(state),
  syncStatus: selectSyncStatus(state),
  participantStatus: selectParticipantStatus(state),
  tokenValidation: selectTokenValidation(state),
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchEvents: () => dispatch(fetchIKFEvents()),
  readEvents: () => dispatch(readIKFEvents()),
  setSelectedEvent: (event: IKFEvent | null) => dispatch(setSelectedEvent(event)),
  fetchParticipants: (eventUID: string, eventID: number) =>
    dispatch(fetchIKFParticipants(eventUID, eventID)),
  fetchAllParticipants: () => dispatch(fetchAllIKFParticipants()),
  getAllParticipants: () => dispatch(getAllIKFParticipants()),
  fetchBrackets: (eventUID: string, eventID: number) =>
    dispatch(fetchIKFBrackets(eventUID, eventID)),
  enrichParticipants: (eventId?: string, forceUpdate?: boolean) =>
    dispatch(enrichIKFParticipants(eventId, forceUpdate)),
  syncEventsToFirebase: () => dispatch(syncEventsToFirebase()),
  syncParticipantsToFirebase: (eventUID: string, eventID: number) =>
    dispatch(syncParticipantsToFirebase(eventUID, eventID)),
  syncBracketsToFirebase: (eventUID: string, eventID: number) =>
    dispatch(syncBracketsToFirebase(eventUID, eventID)),
  getParticipantStatus: () => dispatch(getParticipantStatus()),
  validateToken: () => dispatch(validateIKFToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IKFManagement);
