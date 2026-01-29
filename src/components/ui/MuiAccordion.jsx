import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MuiAccordion = ({
  items = [], // [{summary, details, defaultExpanded}]
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <Accordion
          key={index}
          defaultExpanded={item.defaultExpanded}
          sx={{
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px !important',
            mb: 2,
            overflow: 'hidden',
            '&:before': { display: 'none' }, // Remove default MUI divider
            boxShadow: 'var(--shadow-sm)',
            '&:hover': {
              boxShadow: 'var(--shadow-md)',
              borderColor: 'var(--color-primary-500)',
            },
            transition: 'all 0.3s ease',
          }}
          className={className}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'var(--color-primary-500)' }} />}
            sx={{
              color: 'var(--color-text-primary)',
              fontWeight: 600,
              '& .MuiAccordionSummary-content': { my: 1 }
            }}
          >
            {item.summary}
          </AccordionSummary>
          <AccordionDetails sx={{ color: 'var(--color-text-secondary)', pt: 0, pb: 2 }}>
            {item.details}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default MuiAccordion;
