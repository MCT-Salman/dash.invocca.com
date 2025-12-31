import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const MuiImageList = ({
  items = [], // [{src, alt, title, cols, rows}]
  cols = 3,
  rowHeight = 164,
  gap = 8,
  className = '',
  ...props
}) => {
  return (
    <ImageList
      cols={cols}
      rowHeight={rowHeight}
      gap={gap}
      className={`!rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {items.map((item, index) => (
        <ImageListItem
          key={index}
          cols={item.cols || 1}
          rows={item.rows || 1}
          className="hover:opacity-90 transition-opacity"
        >
          <img
            src={item.src}
            alt={item.alt || ''}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default MuiImageList;
