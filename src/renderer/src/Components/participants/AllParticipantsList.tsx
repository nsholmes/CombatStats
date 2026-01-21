import {
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { IKFParticipant } from '@nsholmes/combat-stats-types/fighter.model';
import React, { useMemo, useState } from 'react';

type ExtendedParticipant = IKFParticipant & {
  eventCount: number;
  eventIds: number[];
};

interface AllParticipantsListProps {
  participants: ExtendedParticipant[];
  loading: boolean;
  onParticipantClick: (participant: ExtendedParticipant) => void;
}

export default function AllParticipantsList({
  participants,
  loading,
  onParticipantClick,
}: AllParticipantsListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter participants based on search query
  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants;

    const query = searchQuery.toLowerCase();
    return participants.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const email = (p.email || '').toLowerCase();
      const profileName = (p.profileName || '').toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        profileName.includes(query)
      );
    });
  }, [participants, searchQuery]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        All Participants ({participants.length})
      </Typography>

      {/* Search Field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by name, email, or profile name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.5)' }} />
          ),
        }}
        sx={{
          mb: 2,
          '& .MuiInputBase-root': {
            color: '#fff',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
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
        }}
      />

      {/* Results Count */}
      <Typography
        variant="body2"
        sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
        {searchQuery
          ? `Showing ${filteredParticipants.length} of ${participants.length} participants`
          : `${participants.length} participants`}
      </Typography>

      {/* Participants List */}
      <Paper
        sx={{
          maxHeight: 500,
          overflow: 'auto',
          bgcolor: '#2d2d2d',
        }}>
        {filteredParticipants.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              {searchQuery
                ? `No participants found matching "${searchQuery}"`
                : 'No participants available'}
            </Typography>
          </Box>
        ) : (
          filteredParticipants.map((p) => (
            <Box
              key={p.competitorId}
              onClick={() => onParticipantClick(p)}
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(144, 202, 249, 0.08)',
                },
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#90caf9',
                      fontWeight: 500,
                      '&:hover': { textDecoration: 'underline' },
                    }}>
                    {p.firstName} {p.lastName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {p.email || 'No email'} | Weight: {p.weight || 'N/A'} | Height:{' '}
                    {p.height || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'primary.dark',
                      color: 'primary.contrastText',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      fontWeight: 'bold',
                    }}>
                    {p.eventCount} Event{p.eventCount > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
