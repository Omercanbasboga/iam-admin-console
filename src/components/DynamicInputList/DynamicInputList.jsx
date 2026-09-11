import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Editable list of plain-text values (redirect URIs, allowed origins, whatever a form
 * needs an open-ended list of) with add/remove controls. Kept deliberately generic —
 * the original use case was a client's list of allowed redirect/post-logout URLs.
 */
export default function DynamicInputList({ values, onChange, placeholder = "https://" }) {
  const updateAt = (index, value) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const add = () => onChange([...values, ""]);

  return (
    <Box>
      {values.map((value, index) => (
        <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={value}
            placeholder={placeholder}
            onChange={(e) => updateAt(index, e.target.value)}
          />
          <IconButton size="small" onClick={() => removeAt(index)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={add}>
        Add
      </Button>
    </Box>
  );
}

DynamicInputList.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
