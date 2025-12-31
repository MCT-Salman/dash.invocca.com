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
          className="!bg-yellow-pale !border !border-beige-light !shadow-md !rounded-2xl !mb-3 last:!mb-0 hover:!shadow-lg !transition-all !duration-300"
          {...props}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="!text-primary-600" />}
            className="!text-primary-500 !font-semibold"
          >
            {item.summary}
          </AccordionSummary>
          <AccordionDetails className="!text-text-secondary">
            {item.details}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default MuiAccordion;
