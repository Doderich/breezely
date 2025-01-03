import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  label: string;
  value: string[];
  onChange: (selectedValues: string[]) => void;
}

const MultiSelectDropdown = ({
  options,
  label,
  value,
  onChange,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState(value || []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  // Handle checkbox selection
  const handleOptionSelect = (optionValue: string) => {
    let updatedOptions;
    if (selectedOptions.includes(optionValue)) {
      updatedOptions = selectedOptions.filter((item) => item !== optionValue);
    } else {
      updatedOptions = [...selectedOptions, optionValue];
    }
    setSelectedOptions(updatedOptions);
    onChange(updatedOptions); // Pass updated selections to parent
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectContainer} onPress={toggleDropdown}>
        <Text style={styles.selectedValues}>
          {selectedOptions.length > 0
            ? selectedOptions.join(", ")
            : "Select options"}
        </Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChangeText={handleSearchChange}
          />
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect(item.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(item.value) && styles.selectedOption,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: 328,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  selectedValues: {
    fontSize: 14,
    color: "#555",
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    maxHeight: 200,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  selectedOption: {
    fontWeight: "bold",
    color: "#007bff",
  },
});