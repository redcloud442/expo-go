import React, { useState } from "react";
import { View } from "react-native";
import { Menu, TextInput, TouchableRipple } from "react-native-paper";

export function Select({
  label,
  value,
  onChange,
  error,
  options = [],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: boolean;
  options: { label: string; value: string }[];
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel =
    options?.find((opt) => opt?.value === value)?.label || "";

  return (
    <View style={{ marginBottom: 4 }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        // The anchor must be the element the menu "sticks" to
        anchor={
          <TouchableRipple
            onPress={() => setVisible(true)}
            // Important: modal context sometimes needs this
            accessibilityLabel={label}
          >
            <View pointerEvents="none">
              <TextInput
                label={label}
                value={selectedLabel}
                mode="outlined"
                error={error}
                editable={false}
                right={<TextInput.Icon icon="chevron-down" />}
              />
            </View>
          </TouchableRipple>
        }
      >
        {options?.map((option) => (
          <Menu.Item
            key={option?.value}
            onPress={() => {
              onChange(option?.value);
              setVisible(false);
            }}
            title={option?.label}
          />
        ))}
      </Menu>
    </View>
  );
}
